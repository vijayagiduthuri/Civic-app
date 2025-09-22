import 'dotenv/config';
export default{
  "expo": {
    "name": "Tech-app",
    "slug": "tech-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/appicon.png",
    "scheme": "techapp",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": false,
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We need your location to provide navigation to the issue location.",
        "MGLMapboxAccessToken": process.env.MAPBOX_ACCESS_TOKEN,
        "UIBackgroundModes": ["location"]
      },
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      "package": "com.anonymous.techapp"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": process.env.MAPBOX_ACCESS_TOKEN,
          "RNMapboxMapsVersion": "11.0.0"
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
                "projectId":"e141764f-b398-40db-84c1-e193f60c4773"
      }
    },
    "owner": "mrs29"
  }
}
