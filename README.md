# Home

Home is a mobile-ready, MEAN stack powered bookmark and service monitor.

  - Provides transparency about the infrastructure and services you provide
  - Provides simple monitoring of services
  - Provides weather updates for your location

The application is a glorified bookmark manager that people on your network can access. The application scans the IP address's port to see if it is open, determining if the service is available.

There is an issue with addresses with port numbers and subdirectories e.g. https://172.23.4.2:8422/ibm/console/. When this is used, the application will sometimes report it as unavailable.


### Version
1.0.0

### Tech

Home uses a number of open source projects to work properly:

* [MongoDB] - Database storing the sections and items
* [Express] - fast node.js network app framework
* [AngularJS] - HTML enhanced for web apps!
* [node.js] - evented I/O for the backend
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [Async] - straight-forward, powerful functions for working with asynchronous JavaScript
* [Winston] - awesome keyboard handler lib by [@thomasfuchs]
* [Portscanner] - scans for services running on a specific port
* [Skycons] - Nice icons for weather0
* [ForecastIO] - Weather

### Installation (Ubuntu)

1. I like to run my production Node programs on port 80. Install iptables if you do not have it.
```sh
sudo apt-get install iptables -y
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```

2. Install the MEAN stack following these instructions from DigitalOcean:
https://www.digitalocean.com/community/tutorials/how-to-install-a-mean-js-stack-on-an-ubuntu-14-04-server

3. Clone this repository
```sh
sudo apt-get install git-core -y
git clone https://github.com/calvinbui/home.git
```

4. You will need to install the dependencies for the program as well.
```sh
cd home
npm install
```

5. Edit the config.json file to include your Forecast.io API key and location latitude and longitude

6. Run the application however you like:
```sh
sudo node server.js //using node
sudo pm2 start server.js //using pm2 - recommended
etc.
```


### Todo's

 - Drag and drop reordering
 - Pin notices e.g. power outage @ 5pm 13th of May
 - Animations

License
----

MIT
