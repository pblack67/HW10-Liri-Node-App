# Liri Node Application

## Video Overview

[LIRI Youtube Video Overview](https://youtu.be/bngkH8kUL2s)

![Concert](/images/concert.png)
![Song](/images/song.png)
![Movie](/images/movie.png)

## Overview
LIRI stands for _Language Interpretation and Recognition Interface_. Liri is a node.js application that takes various text commands as input and outputs information that corresponds to them. It searches for:

* Concerts
* Songs
* Movies
* And more!

## Command Syntax

### Concerts
To search for concerts, use the following command:

_node ./liri.js concert-this <artist/band>_

If no artist/band is specified then it will default to _Pentatonix_. If the band is found Liri will respond with a list of the band's concerts.

### Songs
The search for songs via Spotify, use the following command:

_node ./liri.js spotify-this-song \<songname>_

If no song name is specified then it will default to _The Sign_. Liri may respond with more then one song since many songs may have the same or close to the same title. Only  the top results are shown so the specific artist you're looking for may not appear.

### Movies
The search for movies via OMBD (The Open Movie DataBase), use the following command:

_node ./liri.js movie-this \<moviename>_

If no movie name is specified then it will default to _Mr. Nobody_. Liri may respond with more then one movie since many movies may have the same (or close to the same) title. 

### Commands from a File
Liri also supports a command issued from a file. The file is _random.txt_ and is easily modified to run any command mentioned here. To run the command in random.txt use the collowing command line:

_node ./liri.js do-what-it-says_

### Cowsay
To have Liri put a message of your choice into a text bubble above a cow use the following command:

_node ./liri.js cowsay \<message>_

If no message is specified then it will default to, well, you'll just have to run it and see! Why is this part of the application? Because cows are funny. See [The Far Side](http://www.thefarside.com/) cartoons for more cow-inspired humor. 

## Logging
All commands and their results are logged in the log.txt file as well as displayed in the console. 