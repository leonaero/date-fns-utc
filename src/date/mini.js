export class UTCDateMini extends Date {
  constructor() {
    super();

    if (arguments.length === 0) {
      this.setTime(Date.now());
    } else if (arguments.length === 1) {
      if (typeof arguments[0] === "string") {
        const dateString = arguments[0];
        // Append 'Z' to date strings without timezones to treat them as UTC
        const hasTimezone = dateString.includes('Z') || /[+-]\d{2}:\d{2}/.test(dateString);
        this.setTime(+new Date(hasTimezone ? dateString : `${dateString}Z`));
      } else {
        this.setTime(arguments[0]);
      }
    } else {
      this.setTime(Date.UTC(...arguments));
    }

    // original implementation
    // this.setTime(
    //   arguments.length === 0
    //     ? // Enables Sinon's fake timers that override the constructor
    //       Date.now()
    //     : arguments.length === 1
    //     ? typeof arguments[0] === "string"
    //       ? +new Date(arguments[0])
    //       : arguments[0]
    //     : Date.UTC(...arguments)
    // );
  }

  getTimezoneOffset() {
    return 0;
  }
}

// Replace getter and setter functions with UTC counterparts
const re = /^(get|set)(?!UTC)/;
Object.getOwnPropertyNames(Date.prototype).forEach((method) => {
  if (re.test(method)) {
    const utcMethod = Date.prototype[method.replace(re, "$1UTC")];
    if (utcMethod) UTCDateMini.prototype[method] = utcMethod;
  }
});
