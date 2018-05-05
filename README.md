# Hypertube: Streaming video site made with NodeJs -- 42's project

![home](https://image.ibb.co/e9wUuS/hypertube.png)

## Install

	1. Clone the repo: `git clone https://github.com/VictorBaudot/Hypertube.git`on :
	2. Install packages and launch Maildev: `npm i && npm i -g maildev && maildev`
	3. Add your database configuration in  :
		- Model/SQL.class.js
		- private/db.js
	4. Add your {42, Google, Twitter, Github, Linkedin}'s API credentials in `private/passport.js`
	5. Create tables in your database: `node private/sql_script.js`
	6. Launch the server: `npm start`
	7. Add movies data in film's table (let it run for 1-5 min): `node private/Maj_db.js`
	8. Visit in your browser at: `http://localhost:3001`
	9. You'll get your emails at: `http://localhost:1080`

## Subject 
	This project proposes to create a web application that allows the user to research and
	watch videos.
	The player will be directly integrated to the site, and the videos will be downloaded
	through the BitTorrent protocol.
	The research engine will interrogate multiple external sources of your choice, like for
	example http://www.legittorrents.info, or even https://archive.org

## Key concepts
	* RESTful API
	* i18n
	* Torrent & stream
	* Micro-framework
	* Advanced user registration and sign-in
	* Security (XSS, SQL injection..) 
	* Data validation

## My stack
	* Node.js
	* Express (+ middleware)
	* JavaScript ES6+
	* MySQL
 	* OAuth
	* i18n

## Project’s constraints 

	Mandatory tools: 
		* At minimum compatible with Firefox (>= 41) and Chrome (>= 46).
		* Usable on a mobile phone and keep an acceptable layout on small resolutions

	Forbidden tools:
		* Libraries to create a video stream for a torrent  like webtorrent, pulsar or peerflix


![search](https://image.ibb.co/dQyaZS/batman_hypertube.png)

![filter](https://image.ibb.co/mKVpuS/filter_hypertube.png)