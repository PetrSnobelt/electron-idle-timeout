"use strict";

//based on https://github.com/electron/electron/issues/1528

const ref = require('ref');
const refStruct = require('ref-struct');
const refArray = require('ref-array');
//const ffi = require('ffi-atom-shell'); //failed to install
const ffi = require('ffi');

var intPtr = null;
var boolPtr = null;
var LASTINPUTINFO = null;
var OSVERSIONINFO = null;
var pOSVERSIONINFO = null;
var pLASTINPUTINFO = null;
var shell32 = null;
var user32 = null;
var kernel32 = null;
var dwmApi = null;

let setupWindowsLibs = function() {
  intPtr = intPtr || ref.refType(ref.types.int32);
  boolPtr = boolPtr || ref.refType(ref.types.bool);

  LASTINPUTINFO = LASTINPUTINFO || refStruct({
    cbSize: ref.types.int32,
    dwTime: ref.types.uint32,
  });

  pLASTINPUTINFO = pLASTINPUTINFO || ref.refType(LASTINPUTINFO);

  user32 = user32 || ffi.Library('user32', {
    'GetLastInputInfo': [ 'int', [ pLASTINPUTINFO ] ]
  });

  kernel32 = new ffi.Library("kernel32", {
    "GetTickCount": [ "int", [ ] ],
  });
};

exports = {
  'win32': {
    getIdleTimeInMs: () => {
      setupWindowsLibs();

      let result = new LASTINPUTINFO();
      result.cbSize = LASTINPUTINFO.size;

      let failed = (user32.GetLastInputInfo(result.ref()) === 0);

      if (failed) {
        throw new Error("Couldn't get idle time");
      }

      let ret = kernel32.GetTickCount() - result.dwTime;
      return ret;
    },
  },

  'darwin': {

    getIdleTimeInMs: () => {
      // TODO: Replace with a call to CGEventSourceCounterForEventType
      return 100000000;
    },

  },

  'linux': {
    getIdleTimeInMs: () => {
      return 100000000;
    },
  }
}
module.exports = exports[process.platform];