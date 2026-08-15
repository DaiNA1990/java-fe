// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  isForNx: false,
  production: false,
  appVersion: 'v8.1.8',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: document.location.hostname.indexOf('localhost') > -1
    ? 'http://10.15.24.231:8686/'
    : 'https://asset-sys.thebdev.com/',
  appThemeName: 'FPT',
  appHost: 'http://localhost:4205',
  tinymceBaseUrl: '/tinymce'
};
/*
//localhost
apiUrl: http://localhost:5012/
//DEV
apiUrl: http://10.15.24.231:8012/
//UAT
apiUrl: https://qlts-uat.thebdev.com/
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
