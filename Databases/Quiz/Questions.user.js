// ==UserScript==
// @name         Database Questions
// @namespace    https://github.com/Wolferine3
// @version      1.0
// @description  Database for questions on AMQ trivia
// @author       Wolferine
// @match        https://animemusicquiz.com/*
// ==/UserScript==

const question = ["In \"Claymore\", Priscilla is the most powerful of the Awakened Beings, and Claire's arch nemesis. Before she awakened, what was her rank as a Claymore?",
"I am a male protagonist. I live on my own, and it sure can get lonely when this is the case. One day, I come across an android that saved my life, and turns out she was hired to be my maid. What anime am I from?",
"This anime includes a hyper schoolgirl who goes by the nickname Wildcat.",
"The Rara Army is from which anime?",
"When I was singing one day in the ocean, a cruise was sailing by when a boy who was watching me sing fell overboard. I brought him to shore, but I had to give him my pearl. Unfortunately, without my pearl, I am a completely tonedeaf singer. Did I mention I was a princess? What anime has this plot?",
"Which of the following was based on a classic Chinese novel?",
"In \"Strawberry Panic\" how many people become the Etoile?",
"What year was the movie \"Akira\" released?",
"What anime has the song \"Ark\" from \"Amatsuki\" as its opening?",
"Who sang the opening \"Contradiction\" from the show \"The God of Highschool\"",
"In \"Yu Yu Hakusho\", what level computer does Mitari have to fight in Game Master's territory?",
"This series follows two young girls in the vibrant cityscape of Mars. Through odd circumstances and friendship, they would carve out their own musical identity and eventually, stardom. What is this title?",
"A swordswoman named Alka seeks revenge for the murder of her master. The murderer is one Jin Varrel, a woman with the ability to vaporise people - a power known as the Impurity - and she and Alka cross paths throughout the series. Which anime is this?",
"I'm a failure at everything I do. I don't have any friends because of this, and it is kind of depressing. One day, a tutor showed up at my home, whom is an infant, and says he is going to help me learn... but not for school, but to become a mob boss. What anime am I from?",
"What a strange fate I wound up in... My Grandfather passed away recently, and in his will, he asked me to attend a private all-girls school in which my mother used to attend. This would be fine and all.. Except for the fact that I am a guy! What anime is this unfortunate protagonist from?",
"A 1970s show about a cyborg who battles robots bent on world domination was released in the U.S. with an incorrect title. What was the American name?",
"First released in 2003, this series follows a group of highly specialized cybernetic young assassins girls. Which is it?",
"I have to get away! Those magicians have been on my tail for a while. The reason? I have inside me a magical secret. Inside me I contain the magical tomes in which contain all the secrets of magic. They must be after my magic, so I have to keep running. What is the name of my anime?",
"In \"Trigun\", what is Vash the Stampede's reward in \"double dollars\" for capturing him?",
"What anime is this quote from: 'Why did I rescue this guy in the first place? He's anti-social, thinks he's evil kienival, and hardly speaks. You've got such a gloomy personality, why don't you stop pretending to be human.'",
"This series first aired in 1997, and follows a young girl who has one simple desire, to be a prince. What anime are we talking about?",
"How many times does Ichika get to use the power of the Djinn in \"Uta~Kata\"?",
"What anime is this from: Spearwoman protects pregnant prince.",
"I'm the beautiful genius of all magic. I'm known far across the land as the Bandit Killer. I have an idiot protector, who stays with me because he promised to protect me.. However, I only allow him to stay with me, because I want his sword! What anime am I in?",
"In \".Hack//: Legend of the Twilight\", Rena disappears in what number episode?",
"I hate life. I hate this town. There is no reason for me to bother with going to school... Until one day, I met a strange girl talking to herself. Now my life is filled with weird occurrences, most of which involve trying to set up her drama club. Why am I even doing this? What anime is this from?",
"What series about a team of junior high school athletes centered on a younger student who won a place on the upperclassmen's team?",
"\"What's Up, Guys?\" from \"Shinnosuke Furumoto and Megumi Hayashibara\" is the opening theme to what anime?",
"While the protagonist of this anime has a sword that can kill with ease, the antagonist has a sword that cannot kill. The villain of which anime received the Sword of Healing?",
"After Watase Yuu's creation of \"Fushigi Yuugi\", which famous shoujo anime did she make?",
"This series features a post apocalyptic Tokyo, a fallen detective, a demon who takes the forms of either a young boy or a voluptuous woman, and many mysteries to be solved. Which series am I describing?",
"Ever since I was young, I have had the weird allergy to boys. Because of this, I have grown to love... well, girls... I go to an all-girls catholic school now. One of the girls that talks to me seems really nice. Though, when she touched me, I broke out. What anime is this unfortunate soul from?",
"What series is about a group of assassins who work out of a flower shop?",
"What is the opening song of \"Mugen no Ryvius\" called?",
"What popular 2004 anime about a unique magical traveler was based on a novel by Diana Wynne Jones?",
"What year was the original \"Lupin III\" first broadcast?",
"In the English dubbed opening theme to \"Cardcaptors\", how many cards are mentioned?",
"From what anime is the ending theme that begins with this translated sentence: \"It's too late to cry 'I love you'\".",
"What is the opening theme for the show \"Twin Signal\"?",
"I'm an undead idol in Hokkaido thats being made to help out in zombie extermination! What anime am I from?",
"How many versions of \"Devil☆Idol\" are there in \"Devidol\"?",
"Who sang the insert song \"SEPIA\" from \"TsukiPro the Animation\"?",
"How many members does the male idol group \"TRIGGER\" have?",
"I got killed trying to help a girl, now I'm busy stripping people for the peace of the city. What anime am I from?",
"How many times does \"SoLaMi♡SMILE\" perform in \"PriPara\"?",
"What is the name of the \"Suzuko Mimori\" solo song in \"Kiratto Pri☆Chan\" Season 1?",
"How many unique insert songs does \"Crane Game Girls Galaxy\" have?",
"Who sang the ending song \"Jinsei wa Waltz\" from \"22/7\"?",
"I'm a little girl that uses cards to turn into a grown up idol with my friends to save fairyland! What anime am I from?",
"Who sings the song \"Hadashi no Cinderella\" in \"Idol Memories\"?",
"Who sings the song \"Domisofasolabu♪\" in \"Koiken! Watashi-tachi Anime ni Natchatta!\"?",
"In what anime did female artist \"LiSA\" first appear in?",
"Which of the following anime from studio Gainax does not contain live action footage?",
"Which of the following anime was \"Akiyuki Shinbou\" (known now for his work at studio Shaft) an episode director for?",
"In \"Monster Strike: A Rhapsody Called Lucy -The Very First Song-\", how much money (in yen) is the prize for the band competition?",
"In this post-apocalyptic anime, none of the characters' names are given.",
"In \"Miss Monochrome - The Animation\" how much money (in yen) is stolen from Miss Monochrome?",
"What was Kyoto Animation's first fully independent anime production?",
"Who sang \"Canaria\" in \"Re:Stage! Dream Days\"?",
"How many \"SPR5\" songs are in \"Shoumetsu Toshi\"?",
"In the anime \"The World God Only Knows\", how many girls are shown to be conqured in the anime?",
"What year does \"Nono Hana\" give birth in \"Hugtto! Precure\"?",
"How many Precures are present in \"Eiga Precure All Stars: Haru no Carnival\"?",
"In \"Gundam 00\", what is the name of the anti-Earth Sphere Federation group?",
"The theme music for the character that could only be described as \"Rainbow MILF\" is titled?",
"Just when you thought the \"Old Man dancing wearing only a grass skirt\" gag would end, he appears in the next episode of?",
"Which of the following anime features live action footage of a cat?",
"I got pissed at a guy not being a loyal fan to a small idol group so I made them successful as petty revenge. What anime am I from?",
"What turn is Ignis Dragon drawn on, on average?",
"How many body parts does Nogi Sonoko lose in \"Yuki Yuna Is a Hero: Washio Sumi Chapter\"?",
"How many body parts does Tachibana Hibiki lose in \"Symphogear\"?",
"In the anime \"Hoseki no Kuni\", how many time did Phosphophyllite break or lose her body parts?",
"This BOOMER (1984) sequel movie has the song \"ai wa BOOMERang\" as its ending",
"This early magical girl show is infamous for featuring the unexpected death of the main character. ",
"The insert song \"Search Light\" is a play on words as it was supposed to be performed by characters Sacchi x Hikari, but ended up only being sung by who?",
"As a result of COVID-19, which anime had a sequel specifically produced to promote safe practices to kids, with an OP by \"AŌP\" about washing hands?",
"In which series of \"Yu-Gi-Oh!\" does the protagonist have the most on-screen losses?",
"In \"Gundam Wing\" , how many times does heero yuy attempt to blow up his gundam?",
"This character from \"K-ON!\" plays their instrument left-handed.",
"After receiving unwanted gender reassignment surgery from aliens, our protagonist finds 'her'self in a yuri love triangle in this anime",
"In the full version of OP1, it starts with \"a night sky full of cries, hearts filled with lies, the contract, is it worth the price? a soul pledged to the darkness...\"",
"This anime first appeared in \"Japan Animator Expo\", but now it has its own show and has \"DAOKO\" to perform its music.",
"This season of \"Squid Girl\" didn't have \"ULTRA-PRISM\" perform its opening.",
"In \"Gintama\" 's Monkey Hunter arc, 3 out of 5 cast member got transformed into a giant screwdriver, who are the 2 characters that didnt?",
"How many tentacles does Squid Girl have?",
"What anime has the characters Kanye West, 50 Cents and Queen Latifa",
"In episode 65 of \"Dragon Ball\", Colonel Violet uses a plane ressembling a real plane model to escape from the Peck Peck Tribe. It ressembles a P-[number].",
"How many abilities does SaroArsten's favorite character have?",
"For some stupid reason, this adult visual novel anime adaption aired all of its episodes in reverse order, starting from the end.",
"What is the first mountain Hinata and Aoi climb in \"Yama no Susume\"?",
"In \"Gundam ZZ\", how many known clones does Elpeo Ple have?",
"In \"Gintama\", what is the first pet of Kagura?",
"In which of the following Gundam series did Tequila Gundam make his appearance?",
"What is Wolferine's favourite song?",
"In \"The Melancholy of Haruhi Suzumiya\", how many loops of summer did it take until Kyon was able to break the cycle?",
"In \"Love Lab\", what Studio Ghibli film was parodied on television during a flashback by the character Suzune Tanahashi?",
"In \"Fairy Tail\", where did Natsu and Lucy first meet eachother?",
"What is the nickname of Gundam Gusion who made their first appearance in \"G-tekketsu\" episode 11?",
"What is the name of the first manga drawn by Ashirogi Muto in Bakuman.?",
"What year did the anime \"Microid S\" first aired?",
"In the anime \"Bungo Stray Dogs\", characters are named after japanese author except 1 that is named after a novel's title, who is that character?",
"Whose quote does this belong to? \"People die when they are killed.\"",
"Which seiyuu from the main Konosuba cast is the youngest?",
"Who was the first character shown to die in the show \"Attack on Titan\"?",
"How many dango pillows does Nagisa from \"Clannad\" have?",
"How many times does Chika say her own name in the Kaguya-sama ED song?",
"Which SAO singer has the most total OP/ED songs sang for the franchise?",
"In \"91 Days\" ED Rain or Shine (TV), how many times did \"ELISA\" sang \'la\'?",
"Which of the following is NOT an anime title:",
"Which of the following is NOT an anime title:",
"Which of the following is NOT an anime title:",
"Which of the following is NOT an anime title:",
"Which of the following is NOT an anime title:",
"Which of the following is NOT an artist name:",
"Which of the following is NOT an artist name:",
"Which of the following is NOT an artist name:",
"Which of the following is NOT an artist name:",
"Which of the following is NOT an artist name:",
"Which of the following is NOT a real song name:",
"Which of the following is NOT a real song name:",
"Which of the following is NOT a real song name:",
"Which of the following is NOT a real song name:",
"Which of the following is NOT a real song name:",
"Which of these absurd Light Novel titles is fake:",
"Which of the following Bang Dream bands do NOT sing in a Bushiroad card game anime (Ex: Cardfight!! Vanguard, Future Card Buddyfight)? ",
"Which of the following male idol franchises has the most number of songs in game?",
"Which of the following anime does \"Asaka\" NOT sing in?",
"\"Masami Okui\" has been the only female member of \"JAM Project\" since what year?",
"Yuki Kajiura's first anime work was for which franchise?",
"Which character in \"Aikatsu!\" does Remi NOT sing for in the anime?",
"In the deleted \"Dog Days''\'' insert (because mods thought this was worth deleting) \"Kimi to Boku no Ne-iro\", how many times did \"Yui Horie\" sang \'la\'?",
"Which character of \"Katekyo Hitman Reborn!\" is often called \"baseball freak\"?",
"Which of the following does NOT have 7 or more versions of its ending song?",
"What year did the anime \"Fortune Quest L\" first aired?",
"What year did the anime \"Sayuuki Reload\" first aired?",
"In the anime \"A Certain Magical Index\", Index is said to hold how many grimoires?",
"Which of the following was NOT mentioned by the anime \"The Disastrous Life of Saiki K.\"?",
"Where does Shinnosuke Nohara live in \"Crayon Shin-chan\"?",
"What Zodiac animal is Kyo Sohma from \"Fruits Basket\"?",
"If we were watching episode 122 of \"Inuyasha\", what ending theme would we hear?",
"\"Palm tree in a miniskirt\" which homunculus does this best describe in \"Fullmetal Alchemist\"?",
"Who turns Sophie into an old lady in \"Howl's Moving Castle\"?",
"Kain and Mary Weather are from what Shojo Beat manga?",
"Which of the following has never been a Shichibukai in \"One Piece\"?",
"What does Kaya give Ashitaka as he leaves their village in \"Princess Mononoke\"?",
"In \"Puella Magi Madoka Magica\", which of the following is NOT a main character's wish?",
"In \"Dragon Ball Z\", who is NOT a member of the Ginyu Force?",
"Starting from a small tea shop, the characters search for a samurai who smells like sunflowers. What anime has this plot?",
"Name the anime: in this murder-mystery style anime, the characters are trapped in a school. They must use evidence and their logical thinking skills to find out which people are committing murders. If they fail, all of their lives will be in danger.",
"Name the anime: a group of teenagers are forcibly transported to a fantasy world, where they have to play a series of games. Losing games could mean losing everything, so it's a good thing that the main characters have overpowered abilities!",
"What is the name of the club Hachiman joins in \"My Teen Romantic Comedy SNAFU\"?",
"How many student signatures are required to save Sakurasou in \"The Pet Girl of Sakurasou\"?",
"Which of the following characters is NOT a diary holder in \"Mirai Nikki\"?",
"Peltegeuse Romanee-Conti is the archbishop of which sin in \"Re:ZERO -Starting Life in Another World-\"?",
"Which game is not shown in the \"Gamers!\" opening?",
"In \"Darker than Black\", Hei has been to all of the following places except for?",
"What did Kaizaki get in trouble for having in front of this teacher in \"ReLIFE\"?",
"What is the maximum lifespan (in years) of a Giftia in \"Plastic Memories\"?",
"Which city has Kouko always wanted to go to in \"Golden Time\"?",
"Which of the following is the highest grossing Ghibli film?",
"Which of the following is NOT produced by Kyoto Animation?",
"Which of the following is NOT a species of PPP penguin in \"Kemono Friends\"?",
"How many Exceed (races) are there in the world of Disboard (\"No Game No Life\")?",
"What is the special ingredient in a Golden Power Remix Inui Juice in \"The Prince of Tennis\"?",
"In \"Blue Spring Ride\", Kominato Aya is part Japanese and part...?",
"In \"The Irregular at Magic High School\", which school is Ichijou Masaki from?",
"In \"Ouran High School Host Club\", what color does Hikaru dye his hair after a fight with his twin brother Kaoru?",
"Which guild mate was Momonga talking to before the game shut down in \"Overlord\"?",
"Which of the following territories is under Zen's reign in \"Snow White with the Red Hair\"?",
"To which Destroyer Division unit do Akatsuki, Hibiki, Ikazuchi and Inazuma belong in "\Kantai Collection: KanColle\"? ( _ th)",
"What is the name of Natsume Tsuchimikado's dragon familiar in "\Tokyo Ravens\"?",
"In \"Sayonara, Zetsubou-Sensei\", how many students are there in Itoshiki Nozumu's class?",
"In \"Food Wars! Shokugeki no Soma\", what is the French food award the Kojirou Shinomiya won?",
"Which anime is this quote from: \"An eye for an eye, a tooth for a tooth. Evil for evil.\"?",
"Which anime is this quote from: \"It feels weird telling kids not to do everything that I did.\"?",
"Which anime is this quote from: \"When a man learns to love, he must bear the risk of hatred.\"?",
"Wich anime is this quote from: \"I suppose someday, you will become my enemy as well.\"?",
"In \"Baka & Test: Summon the Beasts\", which class did Class F NOT battle during their lead up to challenging Class A?",
"In \"Hakuōki: Demon of the Fleeting Blossom\", who does NOT drink the Ochimizu?",
"Which animation studio made the original \"Neon Genesis Evangelion\"?",
"What is Shito's special ability in \"Zombie-Loan\"?",
"Who was the host of the goddess Minerva in \"The World God Only Knows: Goddesses Arc\"?",
"In which year did the anime \"Gakuen Alice\" started airing?",
"What is the number of the first Mikasa clone that Kamijou Touma met in \"A Certain Scientific Railgun\"?",
"Which club was Tatsuhiro Satou part of in high school (\"Wlelcome to the NHK!\") ?",
"Which Studio Ghibli film was Hayao Miyazaki NOT the director/screenwriter/producer of?",
"In \"Katanagatari\", which of the following is the Deviant Blade that Houou Maniwa owns?",
"What was the first song Kahoko Hino played on the magical violin in \"La Corda D'Oro: primo passo\"?",
"What is the first lucky item Midorima is seen carrying in \"Kuroko's Basket\"?",
"What is the class number of Inukai Isuke in \"Riddle Story of Devil\"?",
"Of the following studios, which one is the oldest?",
"What animal is Akira Agarkar Yamada most associated with in \"Tsuritama\"?",
"How many time loops had the Endless Eight arc taken when it ended in \"The Melancholy of Haruhi Suzumiya\"?",
"Which country did Edward's father come from in \"Fullmetal Alchemist: Brotherhood\"?",
"In \"Magi: The Labyrinth of Magic\", Alibaba is the prince of which country?",
"Which of the following is NOT a starter Pokémon middle evolution?",
"In the first episode of \"Code Geass: Lelouch of the Rebellion\", how many minutes did Lelouch say he needed to defeat his opponent at chess?",
"Which of the following characters did NOT appear in the first season of \"Date a Live\"?",
"Which one ot the following is NOT an animation studio?",
"What was the last boss that Kirito and the other players fought on the 75th floor of Aincrad in \"Sword Art Online\"?",
"What is the first celestial key received by Lucy Heartfilia in \"Fairy Tail\"?",
"In what anime is this quote from: \"But I'm sure that even if we had written 1,000 text messages back and forth, our hearts probably wouldn’t have moved... closer\"?",
"In what anime is this quote from: \"I want to go to such a world. Water and air in such vast quantities that they can bend light. That’s amazing!\"?",
"In the first opening of \"Is the order a rabbit?\", \"Daydream Café\", the characters are playing cards for a short period of time. What pair of cards is played last?",
"In \"Soul Eater\", which numbers do the students of DWMA write on a reflective surface to contact Shinigami-sama?",
"In \"Food Wars! Shokugeki no Soma\", which Scandinavian country did Nakiri Alice grow up in?",
"Which one of the Seven Kings of Pure Color was killed during a meeting between the Kings in \"Accel World\"?",
"What is the brand of the piano that Arima Kousei plays on in \"Your Lie in April\"?",
"How far does Midoriya Izuku throw a baseball during his first class at U.A. in \"My Hero Academia\" (in meters)?",
"In \"Amagi Brillant Park\", how many visitors must the park attract, over 3 months, in order for it to not be closed down?",
"In \"No Game No Life\", what is Imanity's chess piece?",
"What is the name of the demon in Hiiragi Shinoa's Cursed Gear in \"Seraph of the End\"?",
"Which of the following animals represents Hazuki Nagisa in \"Free!\"?",
"In \"The Girl Who Leapt Through Time\", on which part of her body did Makoto find the tattoo indicating the remaining number of times she can time leap?",
"In \"Death Note\", who was the first person Light Yagami killed with the Death Note?",
"Who voiced Honma Meiko in \"Anohana.\"?",
"In what anime is this quote from: \"Forty thousand brothers could not, with all their quantity of love, make up my sum.\"?",
"In what anime is this quote from: \"It's been ten years since you fell into the Abyss.\"?",
"In what anime is this quote from: \"The law doesn't protect the people - the people protect the law.\"?",
"In what anime is this quote from: \"If... If you've forgotten, please don't say any more. Please forget this ever happened. This will be farewell, HImura Yuu-san. Even now, I despise you.\"?",
"In \"The Garden of Words\", what does Takao offer to make to Yukari?"];
