/**
 * Ghoststream Catalog
 *
 * A hand-curated library of classic films and cartoons that are in the
 * PUBLIC DOMAIN (or freely licensed), streamed and downloaded directly
 * from the Internet Archive (archive.org).
 *
 * Every identifier below has been verified against archive.org.
 * Content is 100% free, legal, and ad-free — forever.
 */

export type Genre =
  | "featured"
  | "horror"
  | "noir"
  | "scifi"
  | "comedy"
  | "silent"
  | "cartoon"
  | "western"
  | "cult"
  | "pioneers"
  | "hitchcock"
  | "adventure"
  | "drama"
  | "open";

export interface MediaItem {
  /** archive.org identifier (verified) */
  id: string;
  title: string;
  year: number;
  /** approximate runtime in minutes (display only) */
  runtime?: number;
  overview: string;
  genres: Genre[];
  kind: "movie" | "cartoon";
  featured?: boolean;
  note?: string;
}

export const CATALOG: MediaItem[] = [
  // ─── HORROR ────────────────────────────────────────────────────────────
  {
    id: "Night.Of.The.Living.Dead_1080p",
    title: "Night of the Living Dead",
    year: 1968,
    runtime: 96,
    overview:
      "Seven strangers barricade themselves inside a rural farmhouse as the recently dead rise and attack the living. George A. Romero's low-budget masterpiece invented the modern zombie genre — and slipped into the public domain because its theatrical print carried no copyright notice.",
    genres: ["horror", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "Nosferatu_DVD_quality",
    title: "Nosferatu",
    year: 1922,
    runtime: 94,
    overview:
      "F. W. Murnau's unauthorized retelling of Dracula follows the eerie Count Orlok to the German port of Wisborg. Nearly a century later, Max Schreck's rat-faced vampire remains one of cinema's most chilling images.",
    genres: ["horror", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "CarnivalofSouls",
    title: "Carnival of Souls",
    year: 1962,
    runtime: 78,
    overview:
      "After surviving a car crash, a young organist drifts into a waking nightmare haunted by a pale, ghoulish stranger and drawn to an abandoned lakeside pavilion. A cult classic of dreamlike dread that inspired generations of horror filmmakers.",
    genres: ["horror", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "house_on_haunted_hill_ipod",
    title: "House on Haunted Hill",
    year: 1959,
    runtime: 75,
    overview:
      "Vincent Price offers five guests $10,000 each to survive a night in a haunted mansion. Director William Castle's beloved spookshow blends camp, chills and one of horror's great twist endings.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "white_zombie",
    title: "White Zombie",
    year: 1932,
    runtime: 67,
    overview:
      "Bela Lugosi glowers as 'Murder' Legendre, a Haitian voodoo master who turns a young bride into a soulless zombie. The first true zombie film ever made, drenched in gothic atmosphere.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "ThePhantomoftheOpera",
    title: "The Phantom of the Opera",
    year: 1925,
    runtime: 93,
    overview:
      "Lon Chaney's 'Man of a Thousand Faces' haunts the Paris Opera House as the disfigured Erik, obsessed with a young soprano. The unmasking scene still lands like a slap.",
    genres: ["horror", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "DasKabinettdesDoktorCaligariTheCabinetofDrCaligari",
    title: "The Cabinet of Dr. Caligari",
    year: 1920,
    runtime: 76,
    overview:
      "A hypnotist uses a sleepwalking somnambulist to commit murders in a town of jagged, painted shadows. The blueprint of German Expressionism and of every twist-ending thriller since.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Horror_Hotel",
    title: "Horror Hotel (City of the Dead)",
    year: 1960,
    runtime: 78,
    overview:
      "A student of witchcraft travels to the fog-shrouded village of Whitewood, where a burned witch's coven still hungers. Atmospheric black-and-white horror with Christopher Lee.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "TheGhoul",
    title: "The Ghoul",
    year: 1933,
    runtime: 80,
    overview:
      "Boris Karloff plays an Egyptologist who returns from the grave to reclaim a stolen jewel. British gothic horror at its most brooding.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "TheVampireBat",
    title: "The Vampire Bat",
    year: 1933,
    runtime: 60,
    overview:
      "Villagers in a small German town suspect vampires when bodies turn up drained of blood — but the truth is stranger. A snappy little chiller with Fay Wray and Dwight Frye.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Devil_Bat_movie",
    title: "The Devil Bat",
    year: 1940,
    runtime: 69,
    overview:
      "Bela Lugosi breeds giant killer bats and trains them to murder anyone wearing his special aftershave. Gloriously goofy Poverty Row horror.",
    genres: ["horror", "cult"],
    kind: "movie",
  },
  {
    id: "TheCorpseVanishes",
    title: "The Corpse Vanishes",
    year: 1942,
    runtime: 64,
    overview:
      "Brides keep dying at the altar and their bodies vanish. A reporter's investigation leads to Lugosi's mansion and his orchid-scented bride-napping scheme.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "One_Body_Too_Many",
    title: "One Body Too Many",
    year: 1944,
    runtime: 74,
    overview:
      "An insurance investigator gets locked in a crypt with a murderer during a will reading in an old dark house. Bela Lugosi shines as a butler who may or may not be the killer.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "TheApeMan",
    title: "The Ape Man",
    year: 1943,
    runtime: 64,
    overview:
      "A mad scientist's experiment turns him half-ape, and he needs fresh spinal fluid to turn back. Lugosi lurks, an actual ape lumbers, and cheap thrills ensue.",
    genres: ["horror", "cult"],
    kind: "movie",
  },
  {
    id: "TheTerror",
    title: "The Terror",
    year: 1963,
    runtime: 81,
    overview:
      "A young officer follows a ghostly woman to a crumbling barony ruled by a mad baron. Shot on leftover sets in days, this Corman quickie pairs Boris Karloff with a very young Jack Nicholson.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Haxan_tinted_and_subtitled",
    title: "Häxan (Witchcraft Through the Ages)",
    year: 1922,
    runtime: 105,
    overview:
      "Part documentary, part nightmare: Benjamin Christensen's Swedish masterwork dramatizes the history of witchcraft with devilish makeup, broom rides and tortured confessions. Still one of the strangest films ever made.",
    genres: ["horror"],
    kind: "movie",
    note: "Tinted, with subtitles",
  },
  {
    id: "Dementia13withSpanishSubtitles",
    title: "Dementia 13",
    year: 1963,
    runtime: 75,
    overview:
      "Francis Ford Coppola's first directed feature: an axe murderer stalks an Irish estate where a family mourns a drowned child. Lean, mean proto-slasher from the Corman school.",
    genres: ["horror"],
    kind: "movie",
    note: "Includes Spanish subtitles",
  },
  {
    id: "TheMostDangerousGame",
    title: "The Most Dangerous Game",
    year: 1932,
    runtime: 63,
    overview:
      "A shipwrecked big-game hunter washes ashore on an island owned by a Russian count who has decided the only worthy prey is man. A rip-roaring pre-Code adventure-horror classic.",
    genres: ["horror", "adventure"],
    kind: "movie",
  },

  // ─── FILM NOIR & THRILLERS ─────────────────────────────────────────────
  {
    id: "Detour",
    title: "Detour",
    year: 1945,
    runtime: 68,
    overview:
      "A nightclub pianist hitchhiking to Los Angeles gets tangled in a dead man's identity and the blackmailer from hell. Edgar G. Ulmer's masterpiece of noir fatalism, shot in six days.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "doa_ipod",
    title: "D.O.A.",
    year: 1949,
    runtime: 83,
    overview:
      "A man walks into a police station to report a murder — his own. Given days to live by slow poison, he races to find his killer. One of the great noir premises, executed at a sprint.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Hitch_Hiker",
    title: "The Hitch-Hiker",
    year: 1953,
    runtime: 71,
    overview:
      "Two friends on a fishing trip pick up a stranded killer who forces them deep into the Baja desert. Ida Lupino's thriller is the first American noir directed by a woman — taut and terrifying.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "kansascityconfidencial",
    title: "Kansas City Confidential",
    year: 1952,
    runtime: 99,
    overview:
      "An ex-con is framed for an armored-car robbery and hunts the masked men who set him up. A brutal heist-noir that inspired Kubrick's The Killing.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "impact",
    title: "Impact",
    year: 1949,
    runtime: 111,
    overview:
      "A wife's murder plot against her husband misfires, sending both spinning through a labyrinth of guilt, blackmail and slow-burning revenge. Slick second-tier noir with first-tier twists.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Quicksand_clear",
    title: "Quicksand",
    year: 1950,
    runtime: 79,
    overview:
      "A mechanic borrows twenty dollars from the cash register to impress a woman — and sinks, step by step, into a life of crime. Mickey Rooney against type, in over his head.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "TheRedHouse",
    title: "The Red House",
    year: 1947,
    runtime: 100,
    overview:
      "A farm boy is warned never to go near the abandoned red house in the woods — so, naturally, he goes. Rural noir with an aching score and a secret worth the dread.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "He_Walked_By_Night.avi",
    title: "He Walked by Night",
    year: 1948,
    runtime: 79,
    overview:
      "Los Angeles detectives methodically hunt a brilliant, cold-blooded electronics thief. Its semi-documentary style and claustrophobic sewer climax inspired Dragnet and a decade of TV cop shows.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "BehindGreenLights_high_Q_mp4",
    title: "Behind Green Lights",
    year: 1946,
    runtime: 63,
    overview:
      "A DA's star witness is found dead in a police station, and a reporter has until dawn to untangle a web of corrupt cops and society secrets. Fast, snappy 1940s whodunit.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Please_Murder_Me",
    title: "Please Murder Me",
    year: 1956,
    runtime: 78,
    overview:
      "A lawyer wins an acquittal for a woman accused of murder — then realizes she really did it, and that he may be her next target. Raymond Burr broods magnificently.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Inner_Sanctum_movie",
    title: "Inner Sanctum",
    year: 1948,
    runtime: 62,
    overview:
      "A woman fleeing her past boards a train and into a nightmare of murder and mistaken identity. Tight little B-noir spun off the famous radio creepshow.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "dressed_to_kill",
    title: "Dressed to Kill",
    year: 1946,
    runtime: 72,
    overview:
      "Sherlock Holmes races to recover three music boxes whose hidden tune unlocks a bank's printing plates. Basil Rathbone and Nigel Bruce's final Holmes film.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "secret_weapon",
    title: "Sherlock Holmes and the Secret Weapon",
    year: 1943,
    runtime: 68,
    overview:
      "Holmes battles Moriarty in wartime Switzerland for control of a revolutionary bombsight. Rathbone's Holmes goes to war against the Nazis in this fast-moving Universal entry.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "dishonored_lady",
    title: "Dishonored Lady",
    year: 1947,
    runtime: 86,
    overview:
      "A Manhattan art-gallery director tries to escape her fast reputation and a stalker's obsession — until murder intervenes. Hedy Lamarr in a lush, moody melodrama of guilt.",
    genres: ["noir", "drama"],
    kind: "movie",
  },
  {
    id: "Saint_Louis_Bank_Robbery",
    title: "The Saint Louis Bank Robbery",
    year: 1959,
    runtime: 93,
    overview:
      "A young get-away driver joins a crew for one last bank job, while an FBI stakeout closes in. A stripped-down heist film shot like a documentary in St. Louis.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Jail_Bait",
    title: "Jail Bait",
    year: 1954,
    runtime: 74,
    overview:
      "A young hood commits a killing, and his father — a plastic surgeon — is forced to give him a new face. Ed Wood-scripted noir with a pre-fame Steve McQueen lurking in the credits.",
    genres: ["noir", "cult"],
    kind: "movie",
  },
  {
    id: "angel_on_my_shoulder",
    title: "Angel on My Shoulder",
    year: 1946,
    runtime: 100,
    overview:
      "The Devil sends a murdered gangster back to Earth in the body of a crusading judge — but the plan backfires. Paul Muni and Claude Rains spar charmingly in this heaven-and-hell fable.",
    genres: ["noir", "drama"],
    kind: "movie",
  },
  {
    id: "Martha_Ivers_movie",
    title: "The Strange Love of Martha Ivers",
    year: 1946,
    runtime: 116,
    overview:
      "A woman's childhood crime binds her to a blackmailing husband — until her childhood love returns to town. Barbara Stanwyck, Kirk Douglas and Van Heflin in a tangled small-town noir.",
    genres: ["noir", "drama"],
    kind: "movie",
  },
  {
    id: "They_Made_Me_A_Criminal_1939",
    title: "They Made Me a Criminal",
    year: 1939,
    runtime: 92,
    overview:
      "A champion boxer, presumed dead in a hotel fire, hides out on an Arizona boys' ranch run by the Dead End Kids. John Garfield punches his way toward redemption.",
    genres: ["noir", "drama"],
    kind: "movie",
  },
  {
    id: "suddenly",
    title: "Suddenly",
    year: 1954,
    runtime: 75,
    overview:
      "Assassins seize a family's living room to shoot the President from its bay window, and a small-town sheriff is all that stands in the way. Frank Sinatra is genuinely chilling as the triggerman.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "TheStranger_0",
    title: "The Stranger",
    year: 1946,
    runtime: 95,
    overview:
      "A war-crimes investigator tracks a fugitive Nazi mastermind hiding as a small-town teacher in Connecticut — married to the judge's daughter. Orson Welles directs and stars.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "amazing_mr_x",
    title: "The Amazing Mr. X",
    year: 1948,
    runtime: 79,
    overview:
      "A suave 'spiritualist' haunts a grieving widow by the seaside — but who is he really conning? Gorgeous low-budget noir with supernatural shivers.",
    genres: ["noir", "horror"],
    kind: "movie",
  },

  // ─── SCI-FI & SPACE ────────────────────────────────────────────────────
  {
    id: "metropolis-1927-bdrip-1080p-x-265-dts-hd-ma-5.1-d-0ct-0r-lew-sev",
    title: "Metropolis",
    year: 1927,
    runtime: 153,
    overview:
      "In a towering future city, the pampered son of the ruler discovers the machine-men toiling underground and the prophet Maria who would unite them. Fritz Lang's monumental epic is the grandfather of all science fiction cinema.",
    genres: ["scifi", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "TheLastManOnEarth_72",
    title: "The Last Man on Earth",
    year: 1964,
    runtime: 86,
    overview:
      "A scientist survives a plague that turned humanity into vampire-like creatures, barricading himself by night and hunting them by day. The first and bleakest adaptation of Richard Matheson's I Am Legend.",
    genres: ["scifi", "horror"],
    kind: "movie",
  },
  {
    id: "lost_world",
    title: "The Lost World",
    year: 1925,
    runtime: 110,
    overview:
      "An expedition to a remote plateau finds dinosaurs still alive and hungry. Willis O'Brien's stop-motion effects paved the road directly to King Kong.",
    genres: ["scifi", "adventure"],
    kind: "movie",
  },
  {
    id: "20000LeaguesUndertheSea",
    title: "20,000 Leagues Under the Sea",
    year: 1916,
    runtime: 105,
    overview:
      "The first great underwater film: Captain Nemo, the Nautilus, and real submerged photography in the earliest feature adaptation of Jules Verne.",
    genres: ["scifi", "adventure"],
    kind: "movie",
  },
  {
    id: "teenagers_from_outerspace",
    title: "Teenagers from Outer Space",
    year: 1959,
    runtime: 85,
    overview:
      "An alien scout falls for an Earth girl while his ray-gun-waving crew prepares the planet for lobster-monster livestock. Gloriously earnest atomic-age junk food.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "Killers_from_space",
    title: "Killers from Space",
    year: 1954,
    runtime: 71,
    overview:
      "A scientist returns from a plane crash with no memory — and eyes that belong to something else. Aliens with ping-pong-ball eyes plan conquest from a cave.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "Assignment_Outer_Space",
    title: "Assignment: Outer Space",
    year: 1960,
    runtime: 73,
    overview:
      "A reporter tags along on a spaceship mission to stop a runaway rocket that is cooking the solar system with radiation. Italian space-opera with gleaming miniatures.",
    genres: ["scifi"],
    kind: "movie",
  },
  {
    id: "FirstSpaceshipOnVenusMPEG",
    title: "First Spaceship on Venus",
    year: 1960,
    runtime: 93,
    overview:
      "A spool of alien film found in the Gobi Desert sends an international crew to Venus, where a dead civilization waits. Sober, eerie Eastern Bloc science fiction.",
    genres: ["scifi"],
    kind: "movie",
  },
  {
    id: "Phantom_Planet",
    title: "The Phantom Planet",
    year: 1961,
    runtime: 82,
    overview:
      "A pilot shrinks to six inches tall after landing on an asteroid-sized planet and must help its tiny people fight invaders. Weird, wonderful Saturday-matinee astronomy.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "VoyagetothePlanetofPrehistoricWomen",
    title: "Voyage to the Planet of Prehistoric Women",
    year: 1968,
    runtime: 78,
    overview:
      "Cosmonauts explore a Venus of seas, robots and telepathic shell-diving women led by a young Mamie Van Doren. Curtis Harrington recut Soviet footage into pure camp poetry.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "In_The_Year_2889",
    title: "In the Year 2889",
    year: 1967,
    runtime: 80,
    overview:
      "After nuclear war, a survivalist holds out in his canyon compound with mutants, molls and a glowing river. Larry Buchanan's TV remake of Roger Corman's Day the World Ended.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "planet_outlaws_ipod",
    title: "Planet Outlaws (Buck Rogers)",
    year: 1953,
    runtime: 72,
    overview:
      "Buck Rogers awakens 500 years in the future to battle the Killer Kane and his hidden desert empire. The 1939 serial recut into a feature — pure ray-gun nostalgia.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "ThePhantomCreeps",
    title: "The Phantom Creeps",
    year: 1939,
    runtime: 75,
    overview:
      "Bela Lugosi as a mad scientist with a killer robot, an exploding spider and a belt that renders him invisible — plotting revenge from a freighter of doom. Serial madness in feature form.",
    genres: ["scifi", "cult"],
    kind: "movie",
  },
  {
    id: "rocketship-x-m-1950",
    title: "Rocketship X-M",
    year: 1950,
    runtime: 77,
    overview:
      "The first postwar rocket-to-space movie: a crew bound for the Moon is flung to Mars and finds the ruins of a dead civilization. Lloyd Bridges, theremin score, atomic anxiety.",
    genres: ["scifi"],
    kind: "movie",
    note: "Colorized version",
  },
  {
    id: "TheMagicSword",
    title: "The Magic Sword",
    year: 1962,
    runtime: 80,
    overview:
      "A young knight with a magic sword, a fire-breathing dragon and a bottled witch storms a wizard's castle to rescue a princess. Bert I. Gordon's fairy-tale epic with a wonderfully hammy Basil Rathbone.",
    genres: ["scifi", "adventure"],
    kind: "movie",
  },

  // ─── COMEDY & MUSICAL ──────────────────────────────────────────────────
  {
    id: "his_girl_friday",
    title: "His Girl Friday",
    year: 1940,
    runtime: 92,
    overview:
      "A newspaper editor schemes to keep his ex-wife and star reporter from remarrying — by dangling one last execution-day scoop in front of her. Cary Grant and Rosalind Russell fire off dialogue at machine-gun speed in Hawks' screwball pinnacle.",
    genres: ["comedy", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "charade_202604",
    title: "Charade",
    year: 1963,
    runtime: 113,
    overview:
      "A widow in Paris discovers her murdered husband stole a fortune — and that every charming man circling her wants it. Audrey Hepburn, Cary Grant, and the best Hitchcock film Hitchcock never made.",
    genres: ["comedy", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "MyManGodfrey1936",
    title: "My Man Godfrey",
    year: 1936,
    runtime: 94,
    overview:
      "A society girl hires a 'forgotten man' from the city dump as the family butler, and he quietly turns the household upside down. Carole Lombard and William Powell in sparkling Depression-era screwball.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "my_favorite_brunette",
    title: "My Favorite Brunette",
    year: 1947,
    runtime: 87,
    overview:
      "A baby photographer dreams of being a detective and gets framed for murder within a day. Bob Hope's noir parody, with Dorothy Lamour and a wink from Bing Crosby.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "TheFlyingDeuces",
    title: "The Flying Deuces",
    year: 1939,
    runtime: 69,
    overview:
      "Ollie falls for a French innkeeper, joins the Foreign Legion to forget, and drags Stan into uniformed chaos. Laurel and Hardy at their most lovable, plus a dance number to die for.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "AfricaScreams",
    title: "Africa Screams",
    year: 1949,
    runtime: 79,
    overview:
      "Bud Abbott and Lou Costello bluff their way onto an African safari as great white hunters — with a cannibal cookbook as luggage. Rapid-fire vaudeville comedy on safari.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "AtWarWithTheArmy",
    title: "At War with the Army",
    year: 1950,
    runtime: 93,
    overview:
      "Martin and Lewis report for duty: one schemes for a promotion, the other just wants to sing to the soda-fountain girl. Their first starring vehicle, belly laughs included.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "cco_jackandthebeanstalk",
    title: "Jack and the Beanstalk",
    year: 1952,
    runtime: 81,
    overview:
      "Abbott & Costello climb the beanstalk into a giant's castle, with a golden-egg-laying hen and a mouse-hating giant. Storybook comedy that plays beautifully for kids.",
    genres: ["comedy", "drama"],
    kind: "movie",
  },
  {
    id: "amazing_adventure",
    title: "The Amazing Adventure",
    year: 1936,
    runtime: 63,
    overview:
      "A bored millionaire wagers he can survive a year earning his own keep — and finds love and purpose along the way. A young Cary Grant in a light romantic fable.",
    genres: ["comedy", "drama"],
    kind: "movie",
  },
  {
    id: "NothingSacred",
    title: "Nothing Sacred",
    year: 1937,
    runtime: 77,
    overview:
      "A reporter turns a small-town woman's misdiagnosis into a national sob story, and New York eats it up. The first screwball shot in Technicolor, scripted by Ben Hecht.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "royal_wedding",
    title: "Royal Wedding",
    year: 1951,
    runtime: 93,
    overview:
      "A brother-and-sister song-and-dance act finds romance in London during a royal wedding week. Fred Astaire dances on the ceiling — that's the whole pitch, and it's perfect.",
    genres: ["comedy", "drama"],
    kind: "movie",
  },
  {
    id: "The_Pied_Piper_of_Hamelin",
    title: "The Pied Piper of Hamelin",
    year: 1957,
    runtime: 87,
    overview:
      "The piper rids Hamelin of rats, and when the town refuses to pay, he pipes away its children. Van Johnson stars in this musical tale told in charming rhyme.",
    genres: ["comedy", "drama"],
    kind: "movie",
  },
  {
    id: "rock_rock_rock",
    title: "Rock, Rock, Rock!",
    year: 1956,
    runtime: 85,
    overview:
      "A teenager hustles to buy a strapless dress for the school hop, soundtracked by early rock'n'roll royalty — Chuck Berry, The Moonglows, Flamingos. A time capsule with a beat.",
    genres: ["comedy", "drama"],
    kind: "movie",
  },

  // ─── SILENT MASTERPIECES ───────────────────────────────────────────────
  {
    id: "The_General_Buster_Keaton",
    title: "The General",
    year: 1926,
    runtime: 79,
    overview:
      "A Confederate railroad engineer chases his stolen locomotive — and his sweetheart — across enemy lines in what may be the greatest action-comedy ever filmed. Buster Keaton performs miracles with real trains.",
    genres: ["silent", "featured"],
    kind: "movie",
    featured: true,
  },
  {
    id: "SteamboatBillJr",
    title: "Steamboat Bill, Jr.",
    year: 1928,
    runtime: 70,
    overview:
      "A dandy college boy tries to win his crusty riverboat father's respect as a cyclone levels the town. Contains the most famous stunt in silent film: a house facade falls around Keaton, frame-perfect.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "sherlock-jr.-1924",
    title: "Sherlock Jr.",
    year: 1924,
    runtime: 45,
    overview:
      "A film projectionist dreams himself into the movie he's showing and becomes the world's greatest detective. Keaton's cinema-about-cinema stunt fantasia — 45 perfect minutes.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "the-navigator-1924",
    title: "The Navigator",
    year: 1924,
    runtime: 65,
    overview:
      "Two spoiled heirs drift out to sea alone on an ocean liner and must master cooking, canons and deep-sea divers to survive. Keaton's biggest hit, and a masterpiece of prop comedy.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "OurHospitality_29",
    title: "Our Hospitality",
    year: 1923,
    runtime: 65,
    overview:
      "A city boy returns to his Appalachian homestead and stumbles into a generations-old feud — his hosts have sworn to kill him, but hospitality forbids harming a guest under their roof. Delightful and daring.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "silent-seven-chances",
    title: "Seven Chances",
    year: 1925,
    runtime: 56,
    overview:
      "To inherit seven million dollars, a bachelor must marry by 7 p.m. — and every woman in town finds out. Builds to the greatest boulder-strewn chase in silent comedy.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "Brzdac1921",
    title: "The Kid",
    year: 1921,
    runtime: 68,
    overview:
      "The Tramp raises an abandoned child as his own, and fights the city to keep him. Chaplin's first feature: 'a picture with a smile — and perhaps, a tear.'",
    genres: ["silent", "drama"],
    kind: "movie",
  },
  {
    id: "CC_1917_06_17_TheImmigrant",
    title: "The Immigrant",
    year: 1917,
    runtime: 25,
    overview:
      "The Tramp crosses the Atlantic in steerage, wins a meal for a penniless mother, and finds trouble in the restaurant. The Mutual short where Chaplin's Little Tramp found his heart.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "HisNewJobCharlesChaplin-1915",
    title: "His New Job",
    year: 1915,
    runtime: 28,
    overview:
      "Charlie takes a job as a film studio carpenter and ends up rewriting the picture from the inside. Keaton-level movie-biz satire from the Essanay years.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "BattleshipPotemkin",
    title: "Battleship Potemkin",
    year: 1925,
    runtime: 75,
    overview:
      "Sailors served rotten meat mutiny, and the people of Odessa rise with them — until the soldiers come down the steps. Eisenstein's montage revolution, still the most studied film ever cut.",
    genres: ["silent", "drama"],
    kind: "movie",
  },
  {
    id: "ThiefOfBagdad1924",
    title: "The Thief of Bagdad",
    year: 1924,
    runtime: 155,
    overview:
      "A thief loves a princess and must out-magic a Mongol prince to win her — flying carpets, six-armed spies and a genie in a bottle. Douglas Fairbanks' Arabian Nights spectacular.",
    genres: ["silent", "adventure"],
    kind: "movie",
  },
  {
    id: "markofzorro-1920",
    title: "The Mark of Zorro",
    year: 1920,
    runtime: 90,
    overview:
      "A foppish aristocrat dons mask and cape to defend California's poor from a tyrant governor. Fairbanks invented the swashbuckling superhero — Zorro's first appearance on screen.",
    genres: ["silent", "adventure"],
    kind: "movie",
  },
  {
    id: "iron_mask",
    title: "The Iron Mask",
    year: 1929,
    runtime: 95,
    overview:
      "The Three Musketeers' final adventure: protect the twin heir of France from Cardinal Richelieu's plot. Fairbanks' farewell to silent swashbuckling, with his only spoken words on film.",
    genres: ["silent", "adventure"],
    kind: "movie",
  },

  // ─── VINTAGE CARTOONS ──────────────────────────────────────────────────
  {
    id: "gullivers_travels1939",
    title: "Gulliver's Travels",
    year: 1939,
    runtime: 76,
    overview:
      "Shipwrecked Gulliver washes ashore in Lilliput, where two kingdoms war over a wedding song. The Fleischer Studios answer to Disney — gorgeous rotoscoped wonder, and America's second animated feature ever.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "superman_1941",
    title: "Superman (The Fleischer Shorts)",
    year: 1941,
    runtime: 10,
    overview:
      "'Faster than a speeding bullet!' The first Superman cartoon cost more per minute than any animation before it — art-deco Metropolis, a mad scientist, and superheroic perfection in ten minutes.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "superman_the_mechanical_monsters",
    title: "Superman: The Mechanical Monsters",
    year: 1941,
    runtime: 10,
    overview:
      "An evil genius looses an army of flying robots to rob Metropolis — Lois Lane stows away on one. The single most influential cartoon in sci-fi history (ask any Gundam or Iron Giant fan).",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "superman_electric_earthquake",
    title: "Superman: Electric Earthquake",
    year: 1942,
    runtime: 9,
    overview:
      "A saboteur floods Manhattan with man-made earthquakes, and only Superman can short-circuit the scheme. Pulp adventure at peak Fleischer.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "superman_eleventh_hour",
    title: "Superman: The Eleventh Hour",
    year: 1942,
    runtime: 9,
    overview:
      "Imprisoned in Japan, Clark Kent sabotages the enemy fleet by night — as Superman. Wartime propaganda with astonishing animation.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "bb_snow_white",
    title: "Betty Boop in Snow White",
    year: 1933,
    runtime: 7,
    overview:
      "Betty Boop tumbles into the uncanny valley of the Mystery Cave while Cab Calloway's 'St. James Infirmary' plays. The strangest, most haunting cartoon of the golden age.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "bb_minnie_the_moocher",
    title: "Betty Boop: Minnie the Moocher",
    year: 1932,
    runtime: 7,
    overview:
      "Betty runs away from home and meets a ghostly walrus — voiced and rotoscoped from Cab Calloway himself — singing the definitive 'Minnie the Moocher.'",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "bb_and_grampy",
    title: "Betty Boop and Grampy",
    year: 1935,
    runtime: 8,
    overview:
      "Betty calls on inventor Grampy to un-bore a birthday party with Rube Goldberg gadgets. Jazz-age joy in eight minutes.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "Popeye_meetsSinbadtheSailor",
    title: "Popeye Meets Sindbad the Sailor",
    year: 1936,
    runtime: 16,
    overview:
      "Sindbad the Sailor boasts he's the greatest — until a certain spinach-eating sailor takes exception. The first Technicolor Popeye special, and Fleischer 3D-set wizardry at its peak.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "PopeyeAliBaba",
    title: "Popeye Meets Ali Baba's Forty Thieves",
    year: 1937,
    runtime: 17,
    overview:
      "Popeye, Olive and Wimpy face Abu Hassan and his forty thieves in the desert. 'Open sesame' has never been funnier.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "little_sweepea",
    title: "Little Swee'Pea",
    year: 1936,
    runtime: 7,
    overview:
      "Popeye babysits Swee'Pea at the zoo, where every animal wants a bite of the baby. Baby-talk crooning and Bluto-free bliss.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "mighty_mouse_wolf_wolf",
    title: "Mighty Mouse: Wolf! Wolf!",
    year: 1944,
    runtime: 7,
    overview:
      "Three little pigs run out of bricks and call animal control — enter Mighty Mouse, singing, to save the day. Pure operetta superheroics.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "felix_the_cat_the_goos_that_laid_the_golden_egg",
    title: "Felix the Cat: The Goose That Laid the Golden Egg",
    year: 1936,
    runtime: 7,
    overview:
      "Felix's golden-egg goose draws a pirate's greed, and the comic ironies pile up. Surreal, silent-era spirit in a sound-era short.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "RudolphTheRed-nosedReindeer1948",
    title: "Rudolph the Red-Nosed Reindeer",
    year: 1948,
    runtime: 8,
    overview:
      "The original Max Fleischer Rudolph cartoon — before the TV special, the song made him famous here, nose glowing from page to screen.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "woody_woodpecker_pantry_panic",
    title: "Woody Woodpecker: Pantry Panic",
    year: 1941,
    runtime: 7,
    overview:
      "Woody ignores the southbound birds and starves through winter — until a hungry cat decides woodpecker is on the menu. Early, feral, hilarious Woody.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "ACornyConcerto1943BugsBunny",
    title: "A Corny Concerto",
    year: 1943,
    runtime: 9,
    overview:
      "Elmer Fudd conducts Viennese waltzes while Bugs Bunny, Porky Pig and a hunting dog act out the music. Warner Bros.' loving parody of Fantasia.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "noveltoon_casper_tfg_theres_good_boos_tonight",
    title: "There's Good Boos Tonight",
    year: 1948,
    runtime: 9,
    overview:
      "Casper the Friendly Ghost befriends a fox cub, and classic cartoon melancholy follows. Bittersweet Halloween staple.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "JerkyTurkey1945",
    title: "Jerky Turkey",
    year: 1945,
    runtime: 8,
    overview:
      "A Pilgrim hunts a wisecracking turkey for Thanksgiving dinner in Tex Avery's gag-a-second frontier. Postwar cartoon comedy at maximum velocity.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "FLIP_FROG-FIDDLESTICKS",
    title: "Fiddlesticks (Flip the Frog)",
    year: 1930,
    runtime: 7,
    overview:
      "Flip the Frog concertizes while a mischievous mouse heckles — the first sound cartoon in color, from Walt Disney's own ex-animator Ub Iwerks.",
    genres: ["cartoon"],
    kind: "cartoon",
  },
  {
    id: "The_Curious_Adventures_of_Mr._Wonderbird",
    title: "The Curious Adventures of Mr. Wonderbird",
    year: 1952,
    runtime: 63,
    overview:
      "A chimney sweep, a shepherdess and a tyrannical king collide in a painterly kingdom in the clouds. An English-dubbed treasure from French animation pioneer Paul Grimault.",
    genres: ["cartoon"],
    kind: "cartoon",
  },

  // ─── WILD WEST ─────────────────────────────────────────────────────────
  {
    id: "angel_and_the_badman",
    title: "Angel and the Badman",
    year: 1947,
    runtime: 100,
    overview:
      "A wounded gunfighter is nursed back to health by a Quaker family — and their daughter's kindness forces him to choose between his guns and his soul. John Wayne produces and stars in his sweetest western.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "WarOfTheWildcats-JohnWayne1943",
    title: "War of the Wildcats (In Old Oklahoma)",
    year: 1943,
    runtime: 102,
    overview:
      "An oil driller and a rancher fight over land — and over Gabby's daughter — in Dakota territory. Big-scale Duke spectacle with a roughneck's romance.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "texas_terror_1935",
    title: "Texas Terror",
    year: 1935,
    runtime: 52,
    overview:
      "A sheriff takes the blame for a killing he didn't commit and rides away broken — until the dead man's daughter needs help. Early Lone Star John Wayne, dusty and fast.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "SagebrushTrail",
    title: "Sagebrush Trail",
    year: 1933,
    runtime: 54,
    overview:
      "An innocent man escapes prison and joins an outlaw gang to find the real killer. One of Wayne's best Monogram quickies, with Yakima Canutt's immortal stuntwork.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "TheLuckyTexan",
    title: "The Lucky Texan",
    year: 1934,
    runtime: 55,
    overview:
      "Duke and his old partner strike gold, and claim-jumpers strike Duke. Rattlesnake-speed B-western with a great dusty chase.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "west_of_the_divide",
    title: "West of the Divide",
    year: 1934,
    runtime: 54,
    overview:
      "A young man hunts his parents' murderer and finds his long-lost brother on the wrong side of the law. Wayne in pure matinée mode.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "ParadiseCanyon",
    title: "Paradise Canyon",
    year: 1935,
    runtime: 52,
    overview:
      "An undercover agent infiltrates a counterfeit ring operating out of a traveling medicine show. Gabby Hayes hams, the Duke punches, 52 minutes fly.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "Winds_of_the_Wasteland",
    title: "Winds of the Wasteland",
    year: 1936,
    runtime: 55,
    overview:
      "Two former Pony Express riders buy a stage line that a ruthless competitor will do anything to bankrupt. The best of Wayne's Lone Star westerns.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "RidersofDestiny_",
    title: "Riders of Destiny",
    year: 1933,
    runtime: 54,
    overview:
      "Singin' Sandy Saunders rides in to restore a stolen water rights deed — John Wayne's first singing cowboy role, and the birth of the musical western.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "westofhotdog",
    title: "West of Hot Dog",
    year: 1924,
    runtime: 20,
    overview:
      "A tenderfoot inherits land out west, and out west inherits him. Keaton's two-reel western spoof — duds, dames and derring-do.",
    genres: ["western", "silent"],
    kind: "movie",
  },

  // ─── SO BAD, THEY'RE GOOD ──────────────────────────────────────────────
  {
    id: "plan-9-from-outer-space",
    title: "Plan 9 from Outer Space",
    year: 1959,
    runtime: 79,
    overview:
      "Aliens resurrect the dead to stop humanity from destroying the universe — with flying saucers on strings, wobbling tombstones and Bela Lugosi's chiropractor doubling for him. Long crowned the best worst movie ever made.",
    genres: ["cult", "scifi"],
    kind: "movie",
  },
  {
    id: "glenorglenda_201305",
    title: "Glen or Glenda",
    year: 1953,
    runtime: 65,
    overview:
      "Ed Wood's confessional pseudo-documentary about a transvestite's secret life, starring Ed Wood himself. Part plea for tolerance, part fever dream — with Bela Lugosi bellowing 'Pull the string!'",
    genres: ["cult"],
    kind: "movie",
  },
  {
    id: "Beast_of_Yucca_Flats_movie",
    title: "The Beast of Yucca Flats",
    year: 1961,
    runtime: 54,
    overview:
      "A defecting scientist wanders into an atomic test and emerges as a mud-caked Tor Johnson. Narrated entirely in fortune-cookie koans: 'Nothing bothers some people, not even flying saucers.'",
    genres: ["cult", "scifi"],
    kind: "movie",
  },
  {
    id: "giant_gila_monster",
    title: "The Giant Gila Monster",
    year: 1959,
    runtime: 74,
    overview:
      "A giant lizard terrorizes a Texas town, and a hot-rodding teen with a ukulele is the town's only hope. Fuzzy, folksy, and weirdly charming.",
    genres: ["cult", "scifi"],
    kind: "movie",
  },
  {
    id: "The_Killer_Shrews",
    title: "The Killer Shrews",
    year: 1959,
    runtime: 69,
    overview:
      "Storm-stranded visitors face giant shrews on a mad scientist's island — played by dogs in shrew suits. 'Killer Shrews, chomp chomp!' earned its MST3K stripes.",
    genres: ["cult", "scifi"],
    kind: "movie",
  },
  {
    id: "brain_that_wouldnt_die",
    title: "The Brain That Wouldn't Die",
    year: 1962,
    runtime: 82,
    overview:
      "A surgeon keeps his fiancée's severed head alive in a pan while shopping for a new body. Sleazy, talky, and unintentionally hilarious — a midnight-movie cornerstone.",
    genres: ["cult", "horror"],
    kind: "movie",
  },
  {
    id: "turner_video_199",
    title: "Robot Monster",
    year: 1953,
    runtime: 66,
    overview:
      "Ro-Man — a gorilla suit with a diving helmet — exterminates humanity with a calcinator ray, pausing only to pine for the last woman on Earth. 'I cannot — yet I must.'",
    genres: ["cult", "scifi"],
    kind: "movie",
  },
  {
    id: "cco_attackofthegiantleeches",
    title: "Attack of the Giant Leeches",
    year: 1959,
    runtime: 62,
    overview:
      "Swamp leeches the size of sofas drain the Louisiana bayou dry, and nobody believes the moonshiners. Roger Corman-produced bayou horror with a side of soap opera.",
    genres: ["cult", "horror"],
    kind: "movie",
  },
  {
    id: "ABucketofBlood",
    title: "A Bucket of Blood",
    year: 1959,
    runtime: 66,
    overview:
      "A busboy becomes the toast of the beatnik art scene with his 'sculptures' — made from the dead. Corman's pitch-black comedy about fame, executed in five days for pocket change.",
    genres: ["cult", "comedy"],
    kind: "movie",
  },
  {
    id: "MissileToTheMoon",
    title: "Missile to the Moon",
    year: 1958,
    runtime: 78,
    overview:
      "Escaped convicts stow away on a rocket and find moon women, rock creatures and a giant spider. A remake of Cat-Women of the Moon with even less shame.",
    genres: ["cult", "scifi"],
    kind: "movie",
  },

  // ─── PIONEERS OF CINEMA ────────────────────────────────────────────────
  {
    id: "Levoyagedanslalune",
    title: "A Trip to the Moon",
    year: 1902,
    runtime: 13,
    overview:
      "Astronomers load a capsule into a cannon, shoot themselves at the moon, and land in its eye. Georges Méliès' hand-painted miracle is where science fiction — and movie magic — began.",
    genres: ["pioneers", "scifi"],
    kind: "movie",
  },
  {
    id: "TheGreatTrainRobbery_555",
    title: "The Great Train Robbery",
    year: 1903,
    runtime: 12,
    overview:
      "Bandits rob a train, a posse rides, and a gun fires at the audience. Edwin Porter's western invented cross-cutting, the chase, and the shot everyone remembers.",
    genres: ["pioneers", "western"],
    kind: "movie",
  },
  {
    id: "FrankensteinfullMovie",
    title: "Frankenstein",
    year: 1910,
    runtime: 13,
    overview:
      "The Edison studio's one-reel Frankenstein: the creature coalesces from boiling chemicals in an effect that still impresses. The first horror film ever made.",
    genres: ["pioneers", "horror"],
    kind: "movie",
  },
  {
    id: "abraham_lincoln",
    title: "Abraham Lincoln",
    year: 1930,
    runtime: 96,
    overview:
      "D.W. Griffith's first talkie follows Lincoln from log cabin to Ford's Theatre. Stately, sentimental, and a fascinating bridge between two eras of filmmaking.",
    genres: ["pioneers", "drama"],
    kind: "movie",
  },
  {
    id: "nanookOfTheNorth1922",
    title: "Nanook of the North",
    year: 1922,
    runtime: 79,
    overview:
      "An Inuit family hunts walrus and builds igloos in the film that defined 'documentary' for a century — part staged, wholly mesmerizing. Robert Flaherty's arctic epic.",
    genres: ["pioneers", "drama"],
    kind: "movie",
  },
  {
    id: "Intolerance",
    title: "Intolerance",
    year: 1916,
    runtime: 197,
    overview:
      "Four stories across 2,500 years — Babylon, Judea, Renaissance France, modern America — cut into one overwhelming argument against hate. Griffith's mad, magnificent answer to his critics.",
    genres: ["pioneers", "drama"],
    kind: "movie",
  },
  {
    id: "ChelovekskinoapparatomManWithAMovieCamera",
    title: "Man with a Movie Camera",
    year: 1929,
    runtime: 68,
    overview:
      "A cameraman films a city waking up, and the film films itself being filmed. Dziga Vertov's kinetic manifesto is repeatedly voted the greatest documentary ever made.",
    genres: ["pioneers", "drama"],
    kind: "movie",
  },
  {
    id: "BerlinSymphonyofaGreatCity",
    title: "Berlin: Symphony of a Great City",
    year: 1927,
    runtime: 65,
    overview:
      "One day in Weimar Berlin, from ghostly dawn streets to blazing electric night, cut to the rhythm of the city itself. The great city symphony film.",
    genres: ["pioneers", "drama"],
    kind: "movie",
  },

  // ─── HITCHCOCK CLASSICS ────────────────────────────────────────────────
  {
    id: "The39Steps_1935",
    title: "The 39 Steps",
    year: 1935,
    runtime: 86,
    overview:
      "An innocent man handcuffed to a stranger races across Scotland to stop a spy ring and clear his name. The template for every chase thriller Hitchcock — and everyone else — made after.",
    genres: ["hitchcock", "noir"],
    kind: "movie",
  },
  {
    id: "Hitchcock_Secret_Agent",
    title: "Secret Agent",
    year: 1936,
    runtime: 86,
    overview:
      "A novelist turned spy hunts a German agent in Switzerland with a fake wife and a conscience that won't shut up. Young Peter Lorre nearly steals the film.",
    genres: ["hitchcock", "noir"],
    kind: "movie",
  },
  {
    id: "YoungandInnocentTheGirlWasYoung",
    title: "Young and Innocent",
    year: 1937,
    runtime: 80,
    overview:
      "A screenwriter finds a corpse on the beach and becomes the prime suspect; the police chief's daughter believes him. Contains the famous crane shot into a drummer's twitching eyes.",
    genres: ["hitchcock", "noir"],
    kind: "movie",
  },
  {
    id: "the-lady-vanishes-1938",
    title: "The Lady Vanishes",
    year: 1938,
    runtime: 96,
    overview:
      "An old governess disappears from a moving train, and everyone denies she ever existed. Witty, suspensful, and the last — many say best — of Hitchcock's British thrillers.",
    genres: ["hitchcock", "noir"],
    kind: "movie",
  },

  // ─── ACTION & ADVENTURE ────────────────────────────────────────────────
  {
    id: "JungleBook",
    title: "Jungle Book",
    year: 1942,
    runtime: 109,
    overview:
      "Mowgli, raised by wolves, returns to the village and leads a hidden treasure hunt through Kipling's jungle. Lush Technicolor adventure with Sabu, and elephants to fall in love with.",
    genres: ["adventure"],
    kind: "movie",
  },
  {
    id: "tarzans_revenge",
    title: "Tarzan's Revenge",
    year: 1938,
    runtime: 70,
    overview:
      "An Olympic decathlete plays the ape man, swinging in to save a safari from a tyrannical emir. Snappy, sun-drenched serial-style adventure.",
    genres: ["adventure"],
    kind: "movie",
  },
  {
    id: "new_adventures_of_tarzan",
    title: "The New Adventures of Tarzan",
    year: 1935,
    runtime: 70,
    overview:
      "Edgar Rice Burroughs' own production company sent Tarzan to Guatemala, shot in real jungles with an authenticity the studio films never matched.",
    genres: ["adventure"],
    kind: "movie",
  },
  {
    id: "tarzan_and_the_green_goddess",
    title: "Tarzan and the Green Goddess",
    year: 1938,
    runtime: 85,
    overview:
      "Tarzan returns to Guatemala for the idol hiding a Mayan secret formula, with villains on his heels. Feature version of the Burroughs serial.",
    genres: ["adventure"],
    kind: "movie",
  },
  {
    id: "CaptainKidd_",
    title: "Captain Kidd",
    year: 1945,
    runtime: 90,
    overview:
      "Charles Laughton's cutthroat pirate schemes to hijack a treasure convoy from the Crown — with Randolph Scott aboard as his token honest man. A proper swashbuckler.",
    genres: ["adventure"],
    kind: "movie",
  },
  {
    id: "BloodontheSun",
    title: "Blood on the Sun",
    year: 1945,
    runtime: 98,
    overview:
      "An American reporter in 1920s Tokyo uncovers Japan's secret plan for world conquest — the Tanaka Memorial — and fights to get it to Washington. James Cagney, surprisingly jujitsu-fluent.",
    genres: ["adventure", "noir"],
    kind: "movie",
  },
  {
    id: "Cyrano_DeBergerac",
    title: "Cyrano de Bergerac",
    year: 1950,
    runtime: 113,
    overview:
      "The big-nosed poet with the silver sword woos Roxane through another man's words. José Ferrer won the Oscar for one of the great theatrical performances on film.",
    genres: ["adventure", "drama"],
    kind: "movie",
  },

  // ─── DRAMA & ROMANCE ───────────────────────────────────────────────────
  {
    id: "Scrooge_1935",
    title: "Scrooge",
    year: 1935,
    runtime: 78,
    overview:
      "The first sound version of A Christmas Carol, with Seymour Hicks as the miser confronted by three spirits. Fog-bound Victorian London, genuine chills, and a softened heart.",
    genres: ["drama"],
    kind: "movie",
  },
  {
    id: "penny_serenade",
    title: "Penny Serenade",
    year: 1941,
    runtime: 119,
    overview:
      "As she packs to leave, a wife replays the records of their marriage — its joys and its unbearable loss. George Stevens' weepie with Cary Grant's Oscar-nominated turn.",
    genres: ["drama"],
    kind: "movie",
  },
  {
    id: "Great_Guy.avi",
    title: "Great Guy",
    year: 1936,
    runtime: 66,
    overview:
      "An honest weights-and-measures inspector takes on the crooked racketeers shortchanging the public. James Cagney at maximum pugnacity in a fast, fun civic-booster comedy-drama.",
    genres: ["drama", "noir"],
    kind: "movie",
  },
  {
    id: "AStarIsBorn",
    title: "A Star Is Born",
    year: 1937,
    runtime: 111,
    overview:
      "A rising actress and a fading star fall in love in Hollywood, and their careers pass each other in opposite directions. The original — remade three times, never bettered.",
    genres: ["drama"],
    kind: "movie",
  },
  {
    id: "little_princess",
    title: "The Little Princess",
    year: 1939,
    runtime: 93,
    overview:
      "Sara Crewe, left at a London boarding school when her father goes to war, holds onto kindness as her fortune crumbles. Shirley Temple's Technicolor gem.",
    genres: ["drama"],
    kind: "movie",
  },
  {
    id: "AsYouLikeIt1936",
    title: "As You Like It",
    year: 1936,
    runtime: 96,
    overview:
      "Rosalind, banished to the Forest of Arden, disguises herself as a boy and woos the man who loves her. Shakespeare with a young Laurence Olivier, idyllically filmed.",
    genres: ["drama"],
    kind: "movie",
  },

  // ─── NEW IN v2.1: more horror, noir, westerns, drama, Stooges,
  // Keaton & Chaplin shorts, and Creative Commons open cinema ──────────

  {
    id: "TheScreamingSkull",
    title: "The Screaming Skull",
    year: 1958,
    runtime: 68,
    overview:
      "A newlywed becomes convinced the skull of her husband's first wife is haunting their estate — and it might be. Atmosphere-drenched AIP Gothic horror.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "DeadMenWalk",
    title: "Dead Men Walk",
    year: 1943,
    runtime: 64,
    overview:
      "George Zucco is twin brothers — one good, one an undead sorcerer rising from the grave for revenge. PRC poverty-row voodoo horror at its moody best.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Scared_to_Death",
    title: "Scared to Death",
    year: 1943,
    runtime: 62,
    overview:
      "Bela Lugosi in color! A woman recounts her own murder from the morgue in this strange noir-horror hybrid — the only color film Lugosi ever starred in.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Bowery_at_Midnight",
    title: "Bowery at Midnight",
    year: 1942,
    runtime: 62,
    overview:
      "Bela Lugosi runs a soup kitchen by day and a crime ring — and zombie dungeon — by night. Poverty-row horror-crime madness with a genuinely creepy climax.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "TheInvisibleGhost",
    title: "The Invisible Ghost",
    year: 1941,
    runtime: 64,
    overview:
      "Bela Lugosi as a kindly doctor who unknowingly becomes a homicidal trance-killer when he glimpses his supposedly dead wife. Monogram minimalism.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "The_Monster_Maker",
    title: "The Monster Maker",
    year: 1944,
    runtime: 64,
    overview:
      "A mad scientist injects a concert pianist with acromegaly serum to force his daughter's hand in marriage. Gloriously deranged cheapie with J. Carrol Naish.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "TheApe1940",
    title: "The Ape",
    year: 1940,
    runtime: 62,
    overview:
      "Boris Karloff as a small-town doctor who dons an ape suit to harvest spinal fluid for a polio cure. It sounds insane because it is.",
    genres: ["horror"],
    kind: "movie",
  },
  {
    id: "Man_Who_Cheated_Himself",
    title: "The Man Who Cheated Himself",
    year: 1951,
    runtime: 81,
    overview:
      "A rich widow kills her husband and her detective lover covers it up — while his own brother investigates. San Francisco noir with a great airport chase finale.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Fear_in_the_Night",
    title: "Fear in the Night",
    year: 1947,
    runtime: 70,
    overview:
      "A bank teller dreams he committed a murder — then finds the bullet hole in his mirror. A tidy little dream-logic noir from the writer of Invasion of the Body Snatchers.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Great_Flamarion_1945",
    title: "The Great Flamarion",
    year: 1945,
    runtime: 77,
    overview:
      "A vaudeville marksman is played for a fool by his unfaithful assistant, and his perfect act becomes the perfect murder. Erich von Stroheim directs and stars.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "railroaded1947_202003",
    title: "Railroaded!",
    year: 1947,
    runtime: 73,
    overview:
      "A gangster's getaway driver is framed for murder and a beautiful hairstylist holds the proof. Early Anthony Mann, tough as rail steel.",
    genres: ["noir"],
    kind: "movie",
  },
  {
    id: "Five_Minutes_To_Live.avi",
    title: "Five Minutes to Live",
    year: 1961,
    runtime: 80,
    overview:
      "A hitman holds a banker's wife hostage while the clock runs out on a ransom plot — with Johnny Cash as the singing killer, guitar and all.",
    genres: ["noir", "cult"],
    kind: "movie",
  },
  {
    id: "TheFastandtheFuriousJohnIreland1954goofyrip",
    title: "The Fast and the Furious",
    year: 1954,
    runtime: 85,
    overview:
      "A fugitive escapes prison, wins a cross-country road race, and falls for the driver's daughter — the ORIGINAL Fast and the Furious, from 1954. Yes, that's why the modern franchise needed its title.",
    genres: ["noir", "adventure"],
    kind: "movie",
  },
  {
    id: "FightingCaravans1931_368",
    title: "Fighting Caravans",
    year: 1931,
    runtime: 92,
    overview:
      "A young scout leads a wagon train through hostile territory while dodging a crooked fur trader. Gary Cooper in early-talkie Technicolor-adjacent frontier spectacle.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "the_big_show",
    title: "The Big Show",
    year: 1936,
    runtime: 73,
    overview:
      "A rodeo star loses his nerve, his horse and his girl, then wins them back at the big show. Gene Autry sings his way through circus-western mayhem.",
    genres: ["western"],
    kind: "movie",
  },
  {
    id: "TheOvertheHillGang",
    title: "The Over-the-Hill Gang",
    year: 1969,
    runtime: 74,
    overview:
      "Three retired Texas Rangers saddle up one last time to clean out the crooks running their friend's town. Grizzled, funny, and full of old-Hollywood faces.",
    genres: ["western", "comedy"],
    kind: "movie",
  },
  {
    id: "meet_john_doe",
    title: "Meet John Doe",
    year: 1941,
    runtime: 122,
    overview:
      "A reporter invents a suicidal everyman for a circulation stunt, a homeless ex-ballplayer plays the part — and a political machine tries to weaponize him. Frank Capra and Gary Cooper at their populist peak.",
    genres: ["drama", "comedy"],
    kind: "movie",
  },
  {
    id: "disorder_in_the_court",
    title: "Disorder in the Court",
    year: 1936,
    runtime: 17,
    overview:
      "The Stooges are star witnesses in a murder trial and proceed to destroy the entire courtroom. 'Take off your hat!' — Curly's finest 17 minutes.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "sing_a_song_of_six_pants",
    title: "Sing a Song of Six Pants",
    year: 1947,
    runtime: 17,
    overview:
      "The Stooges run a tailor shop, hold a creditor's pants hostage, and catch a bank robber with a steam press. Soitenly essential.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "brideless_groom",
    title: "Brideless Groom",
    year: 1947,
    runtime: 17,
    overview:
      "Shemp must marry within hours to inherit half a million dollars — and every ex-girlfriend wants to volunteer. Speed-dating, 1947 style.",
    genres: ["comedy"],
    kind: "movie",
  },
  {
    id: "Cops1922",
    title: "Cops",
    year: 1922,
    runtime: 18,
    overview:
      "Buster accidentally leads the ENTIRE police force on the most epic chase in silent comedy — hundreds of cops, one deadpan man, one doomed horse-drawn keg of nails.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "TheGoat",
    title: "The Goat",
    year: 1921,
    runtime: 22,
    overview:
      "Buster is mistaken for the criminal 'Dead Shot Dan' and takes it from there — the train-track gag alone is worth the price of admission.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "ThePlayhouse",
    title: "The Playhouse",
    year: 1921,
    runtime: 23,
    overview:
      "Keaton plays the audience, the orchestra, every performer and a minstrel-show MC in one legendary special-effects sequence — then wakes to a far more ordinary day.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "TheBoat",
    title: "The Boat",
    year: 1921,
    runtime: 22,
    overview:
      "Buster builds the boat too big for the house, launches it, sinks it, and still saves the family. The Damfino at your service.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "TheBlacksmith",
    title: "The Blacksmith",
    year: 1922,
    runtime: 21,
    overview:
      "Assistant blacksmith Buster wrecks a Rolls-Royce with progressively more creative tools. The anvil gag is canonical.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "ThePaleface",
    title: "The Paleface",
    year: 1922,
    runtime: 20,
    overview:
      "Captured by Indians, Buster earns his life by extinguishing the chief's oil-well fire — the origin of the classic 'putting out fire with gasoline' bit.",
    genres: ["silent", "western"],
    kind: "movie",
  },
  {
    id: "TheHauntedHouse1921",
    title: "The Haunted House",
    year: 1921,
    runtime: 21,
    overview:
      "A bank teller stumbles into a haunted house that's actually a counterfeiter's front — with trapdoors, skeletons, and a stairway to nowhere. Perfect Halloween viewing.",
    genres: ["silent", "horror"],
    kind: "movie",
  },
  {
    id: "Neighbors",
    title: "Neighbors",
    year: 1920,
    runtime: 18,
    overview:
      "Two feuding families, two young lovers, and a fence between them — until Buster builds a human pyramid. Keaton's Romeo & Juliet in 18 minutes.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "HardLuck_201401",
    title: "Hard Luck",
    year: 1921,
    runtime: 22,
    overview:
      "Down-on-his-luck Buster tries and fails at everything — ending with the famous (and famously impossible) fishing-pole dive. Keaton called it his proudest gag.",
    genres: ["silent"],
    kind: "movie",
  },
  {
    id: "TheFrozenNorth1922",
    title: "The Frozen North",
    year: 1922,
    runtime: 17,
    overview:
      "Keaton parodies Western melodramas and William S. Hart in the frozen Yukon, where he sees things that aren't there and robs the wrong saloon.",
    genres: ["silent", "western"],
    kind: "movie",
  },
  {
    id: "CC_1916_10_02_ThePawnshop",
    title: "The Pawnshop",
    year: 1916,
    runtime: 24,
    overview:
      "Charlie the pawnshop clerk dissects a clock, devours a customer's soup, and defuses nitroglycerin with a mallet. Mutual-era Chaplin at top speed.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1916_09_04_TheCount",
    title: "The Count",
    year: 1916,
    runtime: 23,
    overview:
      "A tailor's assistant crashes high society as 'Count Nobody' and out-dances the aristocracy into the fountain. Eric Campbell looms magnificently.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1916_05_15_TheFloorwalker",
    title: "The Floorwalker",
    year: 1916,
    runtime: 25,
    overview:
      "Charlie's doppelgänger is embezzling from the department store — the first great escalator gag in film history.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1916_12_04_TheRink",
    title: "The Rink",
    year: 1916,
    runtime: 24,
    overview:
      "Waiter by day, skating demon by night: Charlie turns a roller rink into a demolition derby and rescues the girl with a spinning entrance.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1916_08_07_One_A_M",
    title: "One A.M.",
    year: 1916,
    runtime: 26,
    overview:
      "A drunk Chaplin battles his own house — the stairs, the tiger rug, the pendulum clock, the moving wall — in a nearly solo slapstick symphony.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1917_04_16_TheCure",
    title: "The Cure",
    year: 1917,
    runtime: 24,
    overview:
      "Charlie checks into a dry-out spa with a trunk full of booze and accidentally cures everyone — of sobriety. The revolving-door gag is pure gold.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "CC_1915_10_04_CharlieShanghaied",
    title: "Shanghaied",
    year: 1915,
    runtime: 26,
    overview:
      "Charlie is shanghaied aboard his own sweetheart's father's ship and mutinies with flour and crockery. Essanay-era chaos at sea.",
    genres: ["silent", "comedy"],
    kind: "movie",
  },
  {
    id: "Sintel",
    title: "Sintel",
    year: 2010,
    runtime: 15,
    overview:
      "A lone warrior crosses mountains and deserts searching for the dragon she raised from a hatchling. The Blender Foundation's epic fantasy short — 4K, gorgeous, and Creative Commons.",
    genres: ["open", "adventure"],
    kind: "cartoon",
    note: "CC-BY · Blender Foundation",
  },
  {
    id: "BigBuckBunny_328",
    title: "Big Buck Bunny",
    year: 2008,
    runtime: 10,
    overview:
      "A big, gentle rabbit has had enough of three bullying rodents — and revenge has never been fluffier. The Blender Institute's beloved open-movie classic.",
    genres: ["open", "cartoon"],
    kind: "cartoon",
    note: "CC-BY · Blender Foundation",
  },
  {
    id: "ElephantsDream",
    title: "Elephants Dream",
    year: 2006,
    runtime: 11,
    overview:
      "Two men navigate a surreal, ever-shifting machine world — the very first open movie ever made, and still one of the strangest. Creative Commons, in HD.",
    genres: ["open", "scifi"],
    kind: "cartoon",
    note: "CC-BY · Blender Foundation",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────

export function posterUrl(id: string): string {
  return `https://archive.org/services/img/${id}`;
}

export function itemPageUrl(id: string): string {
  return `https://archive.org/details/${id}`;
}

export function formatRuntime(minutes?: number): string {
  if (!minutes) return "";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

const catalogIndex = new Map(CATALOG.map((item) => [item.id, item]));

export function getItem(id: string): MediaItem | undefined {
  return catalogIndex.get(id);
}

export interface Row {
  id: string;
  title: string;
  genre: Genre;
}

export const ROWS: Row[] = [
  { id: "featured", title: "👻 Featured on Ghoststream", genre: "featured" },
  { id: "horror", title: "🕯️ Horror Classics", genre: "horror" },
  { id: "noir", title: "🕵️ Film Noir & Thrillers", genre: "noir" },
  { id: "scifi", title: "🚀 Sci-Fi & Space", genre: "scifi" },
  { id: "comedy", title: "🎩 Comedy & Musical", genre: "comedy" },
  { id: "silent", title: "🎬 Silent Masterpieces", genre: "silent" },
  { id: "cartoon", title: "🎨 Vintage Cartoons", genre: "cartoon" },
  { id: "open", title: "✨ Open Cinema (Creative Commons)", genre: "open" },
  { id: "western", title: "🤠 Wild West", genre: "western" },
  { id: "cult", title: "🤪 So Bad, They're Good", genre: "cult" },
  { id: "hitchcock", title: "🎭 Hitchcock Classics", genre: "hitchcock" },
  { id: "adventure", title: "⚔️ Action & Adventure", genre: "adventure" },
  { id: "drama", title: "🌹 Drama & Romance", genre: "drama" },
  { id: "pioneers", title: "📽️ Pioneers of Cinema", genre: "pioneers" },
];

export function itemsForGenre(genre: Genre): MediaItem[] {
  return CATALOG.filter((item) => item.genres.includes(genre));
}

export function searchCatalog(query: string): MediaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return CATALOG.filter((item) => {
    const haystack = [
      item.title.toLowerCase(),
      String(item.year),
      item.kind,
      ...item.genres,
      item.overview.toLowerCase(),
    ].join(" ");
    return terms.every((t) => haystack.includes(t));
  });
}

export const STATS = {
  titles: CATALOG.length,
  movies: CATALOG.filter((i) => i.kind === "movie").length,
  cartoons: CATALOG.filter((i) => i.kind === "cartoon").length,
  oldest: Math.min(...CATALOG.map((i) => i.year)),
};
