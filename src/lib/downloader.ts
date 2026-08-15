/**
 * FFmpeg Stream Downloader
 * Downloads resolved stream URLs using FFmpeg
 * 
 * Architecture:
 * - Receives pre-resolved stream URLs
 * - Manages FFmpeg process
 * - Tracks download progress
 * - Supports quality selection
 */

import { spawn, ChildProcess } from "child_process";
import { ResolvedStream } from "./resolver";

export interface DownloadOptions {
  stream: ResolvedStream;
  outputFilename: string;
  quality: "best" | "1080p" | "720p" | "480p";
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: (success: boolean, error?: string) => void;
}

export interface DownloadProgress {
  timeProcessed: number;
  duration?: number;
  percent: number;
  speed?: string;
  size?: string;
}

export interface DownloadJob {
  id: string;
  filename: string;
  status: "starting" | "downloading" | "completed" | "error";
  progress: number;
  duration?: number;
  error?: string;
  process?: ChildProcess;
}

// Active downloads storage
const activeDownloads: Map<string, DownloadJob> = new Map();

/**
 * Build FFmpeg command arguments
 */
function buildFFmpegArgs(
  stream: ResolvedStream,
  outputFilename: string,
  quality: string
): string[] {
  const args: string[] = [
    "-y", // Overwrite output
    "-fflags", "+nobuffer",
    "-analyzeduration", "0",
    "-probesize", "32",
  ];
  
  // Add referer header if provided
  if (stream.headers?.Referer) {
    args.push("-headers", `Referer: ${stream.headers.Referer}\r\n`);
  }
  
  // Input URL
  args.push("-i", stream.url);
  
  // Quality-specific encoding settings
  switch (quality) {
    case "1080p":
      args.push("-vf", "scale=-2:1080");
      args.push("-c:v", "libx264", "-preset", "ultrafast", "-crf", "23");
      args.push("-c:a", "aac");
      break;
    case "720p":
      args.push("-vf", "scale=-2:720");
      args.push("-c:v", "libx264", "-preset", "ultrafast", "-crf", "23");
      args.push("-c:a", "aac");
      break;
    case "480p":
      args.push("-vf", "scale=-2:480");
      args.push("-c:v", "libx264", "-preset", "ultrafast", "-crf", "23");
      args.push("-c:a", "aac");
      break;
    default:
      // Best quality - stream copy (fastest, no re-encoding)
      args.push("-c", "copy");
      args.push("-bsf:a", "aac_adtstoasc");
  }
  
  // Output file
  args.push(outputFilename);
  
  return args;
}

/**
 * Parse FFmpeg progress output
 */
function parseFFmpegProgress(line: string, job: DownloadJob): void {
  // Parse duration
  const durationMatch = line.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
  if (durationMatch) {
    const hours = parseInt(durationMatch[1]);
    const minutes = parseInt(durationMatch[2]);
    const seconds = parseFloat(durationMatch[3]);
    job.duration = hours * 3600 + minutes * 60 + seconds;
  }
  
  // Parse current time
  const timeMatch = line.match(/time=(\d+):(\d+):(\d+\.\d+)/);
  if (timeMatch) {
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const seconds = parseFloat(timeMatch[3]);
    const currentTime = hours * 3600 + minutes * 60 + seconds;
    job.progress = currentTime;
    job.status = "downloading";
  }
}

/**
 * Start a download using FFmpeg
 */
export function startDownload(options: DownloadOptions): string {
  const { stream, outputFilename, quality, onProgress, onComplete } = options;
  
  const downloadId = `dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const job: DownloadJob = {
    id: downloadId,
    filename: outputFilename,
    status: "starting",
    progress: 0,
  };
  
  activeDownloads.set(downloadId, job);
  
  const args = buildFFmpegArgs(stream, outputFilename, quality);
  
  try {
    const ffmpeg = spawn("ffmpeg", args, {
      cwd: process.cwd(),
    });
    
    job.process = ffmpeg;
    
    // Handle stderr (FFmpeg outputs progress to stderr)
    ffmpeg.stderr.on("data", (data: Buffer) => {
      const line = data.toString();
      parseFFmpegProgress(line, job);
      
      if (onProgress) {
        onProgress({
          timeProcessed: job.progress,
          duration: job.duration,
          percent: job.duration ? (job.progress / job.duration) * 100 : 0,
        });
      }
    });
    
    // Handle process exit
    ffmpeg.on("close", (code: number | null) => {
      if (code === 0) {
        job.status = "completed";
        job.progress = 100;
        if (onComplete) onComplete(true);
      } else {
        job.status = "error";
        job.error = `FFmpeg exited with code ${code}`;
        if (onComplete) onComplete(false, job.error);
      }
    });
    
    ffmpeg.on("error", (err: Error) => {
      job.status = "error";
      job.error = err.message;
      if (onComplete) onComplete(false, err.message);
    });
    
  } catch (error) {
    job.status = "error";
    job.error = error instanceof Error ? error.message : "Failed to start FFmpeg";
    if (onComplete) onComplete(false, job.error);
  }
  
  return downloadId;
}

/**
 * Get download status
 */
export function getDownloadStatus(downloadId: string): DownloadJob | null {
  return activeDownloads.get(downloadId) || null;
}

/**
 * Cancel a download
 */
export function cancelDownload(downloadId: string): boolean {
  const job = activeDownloads.get(downloadId);
  if (job && job.process) {
    job.process.kill("SIGTERM");
    job.status = "error";
    job.error = "Cancelled by user";
    return true;
  }
  return false;
}

/**
 * Get all active downloads
 */
export function getAllDownloads(): DownloadJob[] {
  return Array.from(activeDownloads.values());
}

/**
 * Clean up completed/failed downloads from memory
 */
export function cleanupDownloads(): void {
  for (const [id, job] of activeDownloads.entries()) {
    if (job.status === "completed" || job.status === "error") {
      activeDownloads.delete(id);
    }
  }
}
