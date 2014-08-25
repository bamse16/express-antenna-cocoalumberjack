Express-Antenna-CocoaLumberjack
-----------------

This package is an example endpoint for [Antenna](https://github.com/mattt/Antenna) based [CocoaLumberjack](https://github.com/CocoaLumberjack/CocoaLumberjack) logger.

Usage
-----

Install the package, then start it:

    npm install express-antenna-cocoalumberjack
    node node_modules/express-antenna-cocoalumberjack/app.js
  
To configure it, you can supply the following env variables:

    export NODE_EXPRESS_ANTENNA_PORT=12345
    export NODE_EXPRESS_ANTENNA_LOG_PATH=/tmp/

To verify that the server is running, point your browser to http://yourhost:3205/ping/.

On the objective-c project:

Add `AFNetworking` (2.0), `CocoaLumberjack` and `DDAntennaLogger` to your `Podfile`:

    pod 'AFNetworking'
    pod 'CocoaLumberjack'
    pod 'DDAntennaLogger', :git => 'https://github.com/mokagio/DDAntennaLogger'

Then run:
  
    pod install
  
Then in your `appdelegate.m`:

    [[Antenna sharedLogger] addChannelWithURL:[NSURL URLWithString:@"http://localhost:3205/log/"] method:@"POST"];
    [[Antenna sharedLogger] startLoggingApplicationLifecycleNotifications];
  
    DDAntennaLogger *logger = [[DDAntennaLogger alloc] initWithAntenna:[Antenna sharedLogger]];
    [DDLog addLogger:logger];
  
    DDLogInfo(@"DDAntennaLogger is cool!");

Enjoy it!
