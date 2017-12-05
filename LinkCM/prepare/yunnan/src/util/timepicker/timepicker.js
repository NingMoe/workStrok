(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define('timepicker', ['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node / CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals.
        factory(jQuery);
    }
})(function($) {

    'use strict';

    var $window = $(window);
    var document = window.document;
    var $document = $(document);
    var Number = window.Number;
    var NAMESPACE = 'timepicker';

    // Events
    var EVENT_CLICK = 'click.' + NAMESPACE;
    var EVENT_KEYUP = 'keyup.' + NAMESPACE;
    var EVENT_FOCUS = 'focus.' + NAMESPACE;
    var EVENT_RESIZE = 'resize.' + NAMESPACE;
    var EVENT_SHOW = 'show.' + NAMESPACE;
    var EVENT_HIDE = 'hide.' + NAMESPACE;
    var EVENT_PICK = 'pick.' + NAMESPACE;
    var EVENT_CONSOLE = 'console.' + NAMESPACE;

    // RegExps
    var REGEXP_FORMAT = /(y|M|d|H|m|s)+/g;
    var REGEXP_DIGITS = /\d+/g;
    var REGEXP_YEAR = /^\d{2,4}$/;

    // Classes
    var CLASS_INLINE = NAMESPACE + '-inline';
    var CLASS_DROPDOWN = NAMESPACE + '-dropdown';
    var CLASS_TOP_LEFT = NAMESPACE + '-top-left';
    var CLASS_TOP_RIGHT = NAMESPACE + '-top-right';
    var CLASS_BOTTOM_LEFT = NAMESPACE + '-bottom-left';
    var CLASS_BOTTOM_RIGHT = NAMESPACE + '-bottom-right';
    var CLASS_PLACEMENTS = [CLASS_TOP_LEFT, CLASS_TOP_RIGHT, CLASS_BOTTOM_LEFT, CLASS_BOTTOM_RIGHT].join(' ');
    var CLASS_HIDE = NAMESPACE + '-hide';

    // Maths
    var min = Math.min;

    // Utilities
    var toString = Object.prototype.toString;

    function typeOf(obj) {
        return toString.call(obj).slice(8, -1).toLowerCase();
    }

    function isString(str) {
        return typeof str === 'string';
    }

    function isNumber(num) {
        return typeof num === 'number' && !isNaN(num);
    }

    function isUndefined(obj) {
        return typeof obj === 'undefined';
    }

    function isDate(date) {
        return typeOf(date) === 'date';
    }

    function toArray(obj, offset) {
        var args = [];
        if (Array.from) {
            return Array.from(obj).slice(offset || 0);
        }
        // This is necessary for IE8
        if (isNumber(offset)) {
            args.push(offset);
        }
        return args.slice.apply(obj, args);
    }

    // Custom proxy to avoid jQuery's guid
    function proxy(fn, context) {
        var args = toArray(arguments, 2);
        return function() {
            return fn.apply(context, args.concat(toArray(arguments)));
        };
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function getDaysInMonth(year, month) {
        return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    function parseFormat(format) {
        var source = String(format);
        var template = source.replace(new RegExp('[:;_-\\s+\/]', 'g'), '');
        var tempParts = [template.substring(0, 4), template.substring(4, 6), template.substring(6, 8), template.substring(8, 10), template.substring(10, 12), template.substring(12, 14)]; // source.match(REGEXP_FORMAT)
        var parts = [];
        for (var i = 0; i < tempParts.length; i++) {
            if (tempParts[i]) {
                parts.push(tempParts[i]);
            }
        }
        var length;
        var i;
        if (!parts || parts.length === 0) {
            throw new Error('Invalid date format.');
        }
        format = {
            source: source,
            parts: parts
        };
        length = parts.length;
        for (i = 0; i < length; i++) {
            switch (parts[i]) {
                case 'ss':
                case 's':
                    format.hasSecond = true;
                    break;
                case 'mm':
                case 'm':
                    format.hasMin = true;
                    break;
                case 'HH':
                case 'h':
                    format.hasHour = true;
                    break;
                case 'dd':
                case 'd':
                    format.hasDay = true;
                    break;
                case 'MM':
                case 'M':
                    format.hasMonth = true;
                    break;
                case 'yyyy':
                case 'yy':
                    format.hasYear = true;
                    break;
            }
        }
        return format;
    }

    function timepicker(element, options) {
        options = $.isPlainObject(options) ? options : {};
        if (options.language) {
            options = $.extend({}, timepicker.LANGUAGES[options.language], options);
        }
        this.$element = $(element);
        this.options = $.extend({}, timepicker.DEFAULTS, options);
        this.isBuilt = false;
        this.isShown = false;
        this.isInput = false;
        this.isInline = false;
        this.initialValue = '';
        this.initialDate = null;
        this.startDate = null;
        this.endDate = null;
        this.init();
    }

    timepicker.prototype = {
        constructor: timepicker,
        init: function() {
            var options = this.options;
            var $this = this.$element;
            var startDate = options.startDate;
            var endDate = options.endDate;
            var date = options.date;
            
            this.$trigger = $(options.trigger || $this);
            this.isInput = $this.is('input') || $this.is('textarea');
            this.isInline = options.inline && (options.container || !this.isInput);
            this.format = parseFormat(options.format);

            if (!this.format.hasSecond) {
                options.secondLock = true;
            }

            if (!this.format.hasMin) {
                options.minLock = true;
            }

            this.initialValue = this.getValue();
            date = this.parseDate(date || this.initialValue);
            if (startDate) {
                startDate = this.parseDate(startDate);
                if (date.getTime() < startDate.getTime()) {
                    date = new Date(startDate);
                }
                this.startDate = startDate;
            }
            if (endDate) {
                endDate = this.parseDate(endDate);
                if (startDate && endDate.getTime() < startDate.getTime()) {
                    endDate = new Date(startDate);
                }
                if (date.getTime() > endDate.getTime()) {
                    date = new Date(endDate);
                }
                this.endDate = endDate;
            }
            this.date = date;
            this.viewDate = new Date(date);
            this.initialDate = new Date(this.date);
            this.bind();
            if (options.autoshow || this.isInline) {
                this.show();
            }
            if (options.autopick) {
                this.pick();
            }
        },

        build: function() {
            var options = this.options;
            var $this = this.$element;
            var $picker;
            if (this.isBuilt) {
                return;
            }
            this.isBuilt = true;
            this.$picker = $picker = $(options.template);
            this.$week = $picker.find('[data-view="week"]');
            // Years view
            this.$yearsPicker = $picker.find('[data-view="years picker"]');
            this.$yearsPrev = $picker.find('[data-view="years prev"]');
            this.$yearsNext = $picker.find('[data-view="years next"]');
            this.$yearsCurrent = $picker.find('[data-view="years current"]');
            this.$years = $picker.find('[data-view="years"]');
            // Months view
            this.$monthsPicker = $picker.find('[data-view="months picker"]');
            this.$yearPrev = $picker.find('[data-view="year prev"]');
            this.$yearNext = $picker.find('[data-view="year next"]');
            this.$yearCurrent = $picker.find('[data-view="year current"]');
            this.$months = $picker.find('[data-view="months"]');
            // Days view
            this.$daysPicker = $picker.find('[data-view="days picker"]');
            this.$monthPrev = $picker.find('[data-view="month prev"]');
            this.$monthNext = $picker.find('[data-view="month next"]');
            this.$monthCurrent = $picker.find('[data-view="month current"]');
            this.$days = $picker.find('[data-view="days"]');
            // Times view
            this.$timesPicker = $picker.find('[data-view="times picker"]');
            this.$timesCurrent = $picker.find('[data-view="times current"]');
            this.$times = $picker.find('[data-view="times"]');
            this.$daysCurrent = $picker.find('[data-view="days current"]');
            if (this.isInline) {
                $(options.container || $this).append($picker.addClass(CLASS_INLINE));
            } else {
                $(document.body).append($picker.addClass(CLASS_DROPDOWN));
                $picker.addClass(CLASS_HIDE);
            }
            this.fillWeek();
        },

        unbuild: function() {
            if (!this.isBuilt) {
                return;
            }
            this.isBuilt = false;
            this.$picker.remove();
        },

        bind: function() {
            var options = this.options;
            var $this = this.$element;
            if ($.isFunction(options.show)) {
                $this.on(EVENT_SHOW, options.show);
            }
            if ($.isFunction(options.hide)) {
                $this.on(EVENT_HIDE, options.hide);
            }
            if ($.isFunction(options.pick)) {
                $this.on(EVENT_PICK, options.pick);
            }
            if (this.isInput) {
                $this.on(EVENT_KEYUP, $.proxy(this.keyup, this));
                if (!options.trigger) {
                    $this.on(EVENT_FOCUS, $.proxy(this.show, this));
                }
            }
            // this.$trigger.on(EVENT_CLICK, $.proxy(this.show, this));
            this.show();
        },

        unbind: function() {
            var options = this.options;
            var $this = this.$element;
            if ($.isFunction(options.show)) {
                $this.off(EVENT_SHOW, options.show);
            }
            if ($.isFunction(options.hide)) {
                $this.off(EVENT_HIDE, options.hide);
            }
            if ($.isFunction(options.pick)) {
                $this.off(EVENT_PICK, options.pick);
            }
            if (this.isInput) {
                $this.off(EVENT_KEYUP, this.keyup);
                if (!options.trigger) {
                    $this.off(EVENT_FOCUS, this.show);
                }
            }
            this.$trigger.off(EVENT_CLICK, this.show);
        },

        showView: function(view) {

            var $yearsPicker = this.$yearsPicker;
            var $monthsPicker = this.$monthsPicker;
            var $daysPicker = this.$daysPicker;
            var $timesPicker = this.$timesPicker;
            var format = this.format;

            if (format.hasYear || format.hasMonth || format.hasDay || format.hasHour || format.hasMin || format.hasSecond) {
                switch (Number(view)) {
                    case 5:
                    case 'second':
                        $yearsPicker.addClass(CLASS_HIDE);
                        $monthsPicker.addClass(CLASS_HIDE);
                        $daysPicker.addClass(CLASS_HIDE);

                        if (format.hasSecond) {
                            this.fillTimes('second');
                            $timesPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(0);
                        }
                        break;
                    case 4:
                    case 'min':
                        $yearsPicker.addClass(CLASS_HIDE);
                        $monthsPicker.addClass(CLASS_HIDE);
                        $daysPicker.addClass(CLASS_HIDE);

                        if (format.hasMin) {
                            this.fillTimes('min');
                            $timesPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(0);
                        }
                        break;
                    case 3:
                    case 'hour':
                        $yearsPicker.addClass(CLASS_HIDE);
                        $monthsPicker.addClass(CLASS_HIDE);
                        $daysPicker.addClass(CLASS_HIDE);

                        if (format.hasHour) {
                            this.fillTimes('hour');
                            $timesPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(0);
                        }
                        break;
                    case 2:
                    case 'years':
                        $monthsPicker.addClass(CLASS_HIDE);
                        $daysPicker.addClass(CLASS_HIDE);
                        $timesPicker.addClass(CLASS_HIDE);

                        if (format.hasYear) {
                            this.fillYears();
                            $yearsPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(0);
                        }
                        break;
                    case 1:
                    case 'months':
                        $yearsPicker.addClass(CLASS_HIDE);
                        $daysPicker.addClass(CLASS_HIDE);
                        $timesPicker.addClass(CLASS_HIDE);

                        if (format.hasMonth) {
                            this.fillMonths();
                            $monthsPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(2);
                        }

                        break;
                        // case 0:
                        // case 'days':
                    default:
                        $yearsPicker.addClass(CLASS_HIDE);
                        $monthsPicker.addClass(CLASS_HIDE);
                        $timesPicker.addClass(CLASS_HIDE);
                        if (format.hasDay || format.hasHour) {
                            this.fillDays();
                            $daysPicker.removeClass(CLASS_HIDE);
                        } else {
                            this.showView(1);
                        }
                }
            }
            this.place();
        },

        hideView: function() {
            if (this.options.autohide) {
                this.hide();
            }
        },

        place: function() {
            var options = this.options;
            var $this = this.$element;
            var $picker = this.$picker;
            var containerWidth = $document.outerWidth();
            var containerHeight = $document.outerHeight();
            var elementWidth = $this.outerWidth();
            var elementHeight = $this.outerHeight();
            var width = $picker.width();
            var height = $picker.height();
            var offsets = $this.offset();
            var left = offsets.left;
            var top = offsets.top;
            var offset = parseFloat(options.offset) || 10;
            var placement = CLASS_TOP_LEFT;
            if (top > height && top + elementHeight + height > containerHeight) {
                top -= height + offset;
                placement = CLASS_BOTTOM_LEFT;
            } else {
                top += elementHeight + offset;
            }
            if (left + width > containerWidth) {
                left = left + elementWidth - width;
                placement = placement.replace('left', 'right');
            }
            $picker.removeClass(CLASS_PLACEMENTS).addClass(placement).css({
                top: top,
                left: left,
                zIndex: parseInt(options.zIndex, 10)
            });
        },

        // A shortcut for triggering custom events
        trigger: function(type, data) {
            var e = $.Event(type, data);
            this.$element.trigger(e);
            return e;
        },

        createItem: function(data) {
            var options = this.options;
            var itemTag = options.itemTag;
            var defaults = {
                text: '',
                view: '',
                muted: false,
                picked: false,
                disabled: false
            };
            $.extend(defaults, data);
            return ('<' + itemTag + ' ' + (defaults.disabled ? 'class="' + options.disabledClass + '"' : defaults.picked ? 'class="' + options.pickedClass + '"' : defaults.muted ? 'class="' + options.mutedClass + '"' : defaults.colon ? 'class="' + options.colonClass + '"' : '') + (defaults.view ? ' data-view="' + defaults.view + '"' : '') + '>' + defaults.text + '</' + itemTag + '>');
        },

        fillAll: function() {
            this.fillYears();
            this.fillMonths();
            this.fillDays();
            this.fillTimes('hour');
        },

        fillWeek: function() {
            var options = this.options;
            var weekStart = parseInt(options.weekStart, 10) % 7;
            var days = options.daysMin;
            var list = '';
            var i;
            days = $.merge(days.slice(weekStart), days.slice(0, weekStart));
            for (i = 0; i <= 6; i++) {
                list += this.createItem({
                    text: days[i]
                });
            }
            this.$week.html(list);
        },

        fillYears: function() {
            var options = this.options;
            var disabledClass = options.disabledClass || '';
            var suffix = options.yearSuffix || '';
            var filter = $.isFunction(options.filter) && options.filter;
            var startDate = this.startDate;
            var endDate = this.endDate;
            var viewDate = this.viewDate;
            var viewYear = viewDate.getFullYear();
            var viewMonth = viewDate.getMonth();
            var viewDay = viewDate.getDate();
            var date = this.date;
            var year = date.getFullYear();
            var isPrevDisabled = false;
            var isNextDisabled = false;
            var isDisabled = false;
            var isPicked = false;
            var isMuted = false;
            var list = '';
            var start = -5;
            var end = 6;
            var i;
            for (i = start; i <= end; i++) {
                date = new Date(viewYear + i, viewMonth, viewDay);
                isMuted = i === start || i === end;
                isPicked = (viewYear + i) === year;
                isDisabled = false;
                if (startDate) {
                    isDisabled = date.getFullYear() < startDate.getFullYear();
                    if (i === start) {
                        isPrevDisabled = isDisabled;
                    }
                }
                if (!isDisabled && endDate) {
                    isDisabled = date.getFullYear() > endDate.getFullYear();
                    if (i === end) {
                        isNextDisabled = isDisabled;
                    }
                }
                if (!isDisabled && filter) {
                    isDisabled = filter.call(this.$element, date, options, 'year') === false;
                }
                list += this.createItem({
                    text: viewYear + i,
                    view: isDisabled ? 'year disabled' : isPicked ? 'year picked' : 'year',
                    muted: isMuted,
                    picked: isPicked,
                    disabled: isDisabled
                });
            }
            this.$yearsPrev.toggleClass(disabledClass, isPrevDisabled);
            this.$yearsNext.toggleClass(disabledClass, isNextDisabled);
            this.$yearsCurrent.toggleClass(disabledClass, true).html((viewYear + start) + suffix + ' - ' + (viewYear + end) + suffix);
            this.$years.html(list);
        },

        fillMonths: function() {
            var options = this.options;
            var disabledClass = options.disabledClass || '';
            var months = options.monthsShort;
            var filter = $.isFunction(options.filter) && options.filter;
            var startDate = this.startDate;
            var endDate = this.endDate;
            var viewDate = this.viewDate;
            var viewYear = viewDate.getFullYear();
            var viewDay = viewDate.getDate();
            var date = this.date;
            var year = date.getFullYear();
            var month = date.getMonth();
            var isPrevDisabled = false;
            var isNextDisabled = false;
            var isDisabled = false;
            var isPicked = false;
            var list = '';
            var i;
            for (i = 0; i <= 11; i++) {
                date = new Date(viewYear, i, viewDay);
                isPicked = viewYear === year && i === month;
                isDisabled = false;
                if (startDate) {
                    isPrevDisabled = date.getFullYear() === startDate.getFullYear();
                    isDisabled = isPrevDisabled && date.getMonth() < startDate.getMonth();
                }
                if (!isDisabled && endDate) {
                    isNextDisabled = date.getFullYear() === endDate.getFullYear();
                    isDisabled = isNextDisabled && date.getMonth() > endDate.getMonth();
                }
                                
                if (!isDisabled && filter) {
                    isDisabled = filter.call(this.$element, date, options, 'month') === false;
                }
                list += this.createItem({
                    index: i,
                    text: months[i],
                    view: isDisabled ? 'month disabled' : isPicked ? 'month picked' : 'month',
                    picked: isPicked,
                    disabled: isDisabled
                });
            }
            this.$yearPrev.toggleClass(disabledClass, isPrevDisabled);
            this.$yearNext.toggleClass(disabledClass, isNextDisabled);
            this.$yearCurrent.toggleClass(disabledClass, isPrevDisabled && isNextDisabled).html(viewYear + options.yearSuffix || '');
            this.$months.html(list);
        },

        fillDays: function() {
            var options = this.options;
            var disabledClass = options.disabledClass || '';
            var suffix = options.yearSuffix || '';
            var months = options.monthsShort;
            var weekStart = parseInt(options.weekStart, 10) % 7;
            var filter = $.isFunction(options.filter) && options.filter;
            var startDate = this.startDate;
            var endDate = this.endDate;
            var viewDate = this.viewDate;
            var viewYear = viewDate.getFullYear();
            var viewMonth = viewDate.getMonth();
            var prevViewYear = viewYear;
            var prevViewMonth = viewMonth;
            var nextViewYear = viewYear;
            var nextViewMonth = viewMonth;
            var date = this.date;
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var isPrevDisabled = false;
            var isNextDisabled = false;
            var isDisabled = false;
            var isPicked = false;
            var prevItems = [];
            var nextItems = [];
            var items = [];
            var total = 42; // 6 rows and 7 columns on the days picker
            var length;
            var i;
            var n;
            // Days of previous month
            // -----------------------------------------------------------------------
            if (viewMonth === 0) {
                prevViewYear -= 1;
                prevViewMonth = 11;
            } else {
                prevViewMonth -= 1;
            }
            // The length of the days of previous month
            length = getDaysInMonth(prevViewYear, prevViewMonth);
            // The first day of current month
            date = new Date(viewYear, viewMonth, 1);
            // The visible length of the days of previous month
            // [0,1,2,3,4,5,6] - [0,1,2,3,4,5,6] => [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6]
            n = date.getDay() - weekStart;
            // [-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6] => [1,2,3,4,5,6,7]
            if (n <= 0) {
                n += 7;
            }
            if (startDate) {
                isPrevDisabled = date.getTime() <= startDate.getTime();
            }
            for (i = length - (n - 1); i <= length; i++) {
                date = new Date(prevViewYear, prevViewMonth, i);
                isDisabled = false;
                  
                if (startDate) {
                    isDisabled = date.getTime() < startDate.getTime();
                }
                if (!isDisabled && filter) {
                    isDisabled = filter.call(this.$element, date, options, 'day') === false;
                }
                prevItems.push(this.createItem({
                    text: i,
                    view: 'day prev',
                    muted: true,
                    disabled: isDisabled
                }));
            }

            // Days of next month
            // -----------------------------------------------------------------------
            if (viewMonth === 11) {
                nextViewYear += 1;
                nextViewMonth = 0;
            } else {
                nextViewMonth += 1;
            }
            // The length of the days of current month
            length = getDaysInMonth(viewYear, viewMonth);
            // The visible length of next month
            n = total - (prevItems.length + length);
            // The last day of current month
            date = new Date(viewYear, viewMonth, length);
            if (endDate) {
                isNextDisabled = date.getTime() >= endDate.getTime();
            }
            for (i = 1; i <= n; i++) {
                date = new Date(nextViewYear, nextViewMonth, i);
                  
                isDisabled = false;
                if (endDate) {
                    isDisabled = date.getTime() > endDate.getTime();
                }
                if (!isDisabled && filter) {
                    isDisabled = filter.call(this.$element, date, options, 'day') === false;
                }
                nextItems.push(this.createItem({
                    text: i,
                    view: 'day next',
                    muted: true,
                    disabled: isDisabled
                }));
            }
            // Days of current month
            // -----------------------------------------------------------------------
            for (i = 1; i <= length; i++) {
                date = new Date(viewYear, viewMonth, i);
                isPicked = viewYear === year && viewMonth === month && i === day;
                isDisabled = false;

                if (startDate) {
                    isDisabled = date.getTime() < startDate.getTime();
                }

                if (!isDisabled && endDate) {
                    isDisabled = date.getTime() > endDate.getTime();
                }
                if (!isDisabled && filter) {
                    isDisabled = filter.call(this.$element, date, options, 'day') === false;
                }

                items.push(this.createItem({
                    text: i,
                    view: isDisabled ? 'day disabled' : isPicked ? 'day picked' : 'day',
                    picked: isPicked,
                    disabled: isDisabled
                }));
            }
            // Render days picker
            // -----------------------------------------------------------------------
            this.$monthPrev.toggleClass(disabledClass, isPrevDisabled);
            this.$monthNext.toggleClass(disabledClass, isNextDisabled);
            this.$monthCurrent.toggleClass(disabledClass, isPrevDisabled && isNextDisabled).html(options.yearFirst ? viewYear + suffix + ' ' + months[viewMonth] : months[viewMonth] + ' ' + viewYear + suffix);
            var viewHour = viewDate.getHours();
            var viewMin = viewDate.getMinutes();
            var viewSecond = viewDate.getSeconds();
            viewHour = viewHour < 10 ? '0' + viewHour : viewHour;
            viewMin = viewMin < 10 ? '0' + viewMin : viewMin;
            viewSecond = viewSecond < 10 ? '0' + viewSecond : viewSecond;

            var timeObj = [{
                text: '&lsaquo;&lsaquo;',
                view: 'hour prev',
                picked: false,
                disabled: false
            }, {
                text: parseInt(viewHour),
                view: 'hour current',
                picked: false,
                disabled: false
            }, {
                text: ':',
                colon: true,
                picked: false,
                disabled: false
            }, {
                text: viewMin,
                view: 'min current',
                picked: false,
                disabled: options.minLock
            }, {
                text: ':',
                colon: true,
                picked: false,
                disabled: false
            }, {
                text: viewSecond,
                view: 'second current',
                picked: false,
                disabled: options.secondLock
            }, {
                text: '&rsaquo;&rsaquo;',
                view: 'hour next',
                picked: false,
                disabled: (options.filter.call(options, this.date, options, 'day') === false)
            }];

            var timeArr = [];
            for (var i = 0, timeLen = timeObj.length; i < timeLen; i++) {
                timeArr.push(this.createItem(timeObj[i]));
            }

            this.$timesCurrent.html(timeArr.join(''));
            this.$days.html(prevItems.join('') + items.join(' ') + nextItems.join(''));
        },

        fillTimes: function(type) {
            var options = this.options;
            var yearSuffix = options.yearSuffix || '';
            var dateSuffix = options.dateSuffix || '';
            var months = options.monthsShort;
            var viewDate = this.viewDate;
            var viewYear = viewDate.getFullYear();
            var viewMonth = viewDate.getMonth();
            var viewDay = viewDate.getDate();
            var viewHour = viewDate.getHours();
            var viewMin = viewDate.getMinutes();
            var viewSecond = viewDate.getSeconds();
            var date = this.date;
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hour = date.getHours();
            var min = date.getMinutes();
            var second = date.getSeconds();
            viewHour = viewHour < 10 ? '0' + viewHour : viewHour;
            viewMin = viewMin < 10 ? '0' + viewMin : viewMin;
            viewSecond = viewSecond < 10 ? '0' + viewSecond : viewSecond;
            var items = [];
            var viewDisabled = '';
            var viewPicked = '';
            var isDisabled = false;
            var isPicked = false;
            var tempSuffix = '';
            if (type === 'hour') {
                items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            } else if (type === 'min') {
                items = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            } else if (type === 'second') {
                items = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            }
            viewDisabled = type + ' disable';
            viewPicked = type + ' picked';
            var timeItems = [];
            var tempObj = {
                timeType: type,
                viewHour: viewHour,
                viewMin: viewMin,
                viewSecond: viewSecond,
                hour: hour,
                min: min,
                second: second
            };
            for (var i = 0, length = items.length; i < length; i++) {
                tempObj.index = items[i];
                isPicked = isPickedByType(tempObj);
                isDisabled = false;
                var tempDate = new Date(viewDate);
                tempDate = setDate(type, tempDate, items[i]);
                timeItems.push(this.createItem({
                    text: items[i],
                    view: isDisabled ? viewDisabled : isPicked ? viewPicked : type,
                    picked: isPicked,
                    disabled: (options.filter.call(options, tempDate, options, type) === false),
                }));
            }

            function setDate(type, date, dateStr){
                if (type === 'hour') {
                    date.setHours(dateStr);
                } else if (type === 'min') {
                    date.setMinutes(dateStr);
                } else if (type === 'second'){
                    date.setSeconds(dateStr);
                }
                return date;
            }

            function isPickedByType(obj) {
                var tempPickedState = false;
                switch (obj.timeType) {
                    case 'hour':
                        tempPickedState = obj.index === parseInt(obj.hour, 10);
                        break;
                    case 'min':
                        tempPickedState = parseInt(obj.viewHour, 10) === obj.hour && obj.index === obj.min;
                        break;
                    case 'second':
                        tempPickedState = parseInt(obj.viewHour, 10) === obj.hour && parseInt(obj.viewMin, 10) === obj.min && obj.index === obj.second;
                        break;
                }
                return tempPickedState;
            }
            this.$daysCurrent.html(viewYear + yearSuffix + ' ' + months[viewMonth] + ' ' + viewDay + dateSuffix);
            this.$times.html(timeItems);
        },

        click: function(e) {
            var $target = $(e.target);
            var viewDate = this.viewDate;
            var viewYear;
            var viewMonth;
            var viewDay;
            var viewHour;
            var viewMin;
            var viewSecond;
            var isYear;
            var year;
            var view;
            e.stopPropagation();
            e.preventDefault();
            if ($target.hasClass('disabled')) {
                return;
            }
            viewYear = viewDate.getFullYear();
            viewMonth = viewDate.getMonth();
            viewDay = viewDate.getDate();
            viewHour = viewDate.getHours();
            viewMin = viewDate.getMinutes();
            viewSecond = viewDate.getSeconds();
            view = $target.data('view');
            switch (view) {
                case 'years prev':
                case 'years next':
                    viewYear = view === 'years prev' ? viewYear - 10 : viewYear + 10;
                    year = $target.text();
                    isYear = REGEXP_YEAR.test(year);
                    if (isYear) {
                        viewYear = parseInt(year, 10);
                        this.date = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    }
                    this.viewDate = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    this.fillYears();
                    if (isYear) {
                        this.showView(1);
                        this.pick('year');
                    }
                    break;
                case 'year prev':
                case 'year next':
                    viewYear = view === 'year prev' ? viewYear - 1 : viewYear + 1;
                    this.viewDate = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    this.fillMonths();
                    break;
                case 'year current':
                    if (this.format.hasYear) {
                        this.showView(2);
                    }
                    break;
                    // if (this.format.hasMonth) {
                    //     this.showView(1);
                    // } else {
                    //     this.hideView();
                    // }
                    // break;
                case 'year picked':
                case 'year':
                    viewYear = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    if (this.format.hasMonth) {
                        this.showView(1);
                    } else {
                        this.hideView();
                    }
                    this.pick('year');
                    break;
                case 'month prev':
                case 'month next':
                    viewMonth = view === 'month prev' ? viewMonth - 1 : view === 'month next' ? viewMonth + 1 : viewMonth;
                    this.viewDate = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    this.fillDays();
                    break;
                case 'month current':
                    if (this.format.hasMonth) {
                        this.showView(1);
                    }
                    break;
                case 'month picked':
                    // if (this.format.hasDay) {
                    //     this.showView(0);
                    // } else {
                    //     this.hideView();
                    // }
                    // break;
                case 'month picked':
                case 'month':
                    viewMonth = $.inArray($target.text(), this.options.monthsShort);
                    this.date = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, min(viewDay, 28), viewHour, viewMin, viewSecond);
                    if (this.format.hasDay) {
                        this.showView(0);
                    } else {
                        this.hideView();
                    }
                    this.pick('month');
                    break;
                case 'day prev':
                case 'day next':
                case 'day':
                    viewMonth = view === 'day prev' ? viewMonth - 1 : view === 'day next' ? viewMonth + 1 : viewMonth;
                    viewDay = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.fillDays();
                    if (view === 'day') {
                        this.hideView();
                    }
                    this.pick('day');
                    break;
                case 'day picked':
                    this.hideView();
                    this.pick('day');
                    break;
                case 'hour prev':
                case 'hour next':
                    viewHour = view === 'hour prev' ? viewHour - 1 : view === 'hour next' ? viewHour + 1 : viewHour;
                    this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.fillDays();
                    this.pick('hour');
                    break;
                case 'hour picked':
                case 'hour':
                    viewHour = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.fillTimes('hour');
                    if (this.format.hasDay) {
                        this.showView(0);
                    } else {
                        this.hideView();
                    }
                    this.pick('hour');
                    break;
                case 'hour current':
                    if (this.format.hasHour) {
                        this.showView(3);
                    }
                    break;
                case 'min':
                    viewMin = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.fillTimes('min');
                    if (this.format.hasDay) {
                        this.showView(0);
                    } else {
                        this.hideView();
                    }
                    this.pick('min');
                    break;
                case 'min current':
                    if (this.format.hasMin) {
                        this.showView(4);
                    }
                    break;
                case 'second':
                    viewSecond = parseInt($target.text(), 10);
                    this.date = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.viewDate = new Date(viewYear, viewMonth, viewDay, viewHour, viewMin, viewSecond);
                    this.fillTimes('second');
                    if (this.format.hasDay) {
                        this.showView(0);
                    } else {
                        this.hideView();
                    }
                    this.pick('second');
                    break;
                case 'second current':
                    if (this.format.hasSecond) {
                        this.showView(5);
                    }
                    break;
                case 'today':
                    this.date = new Date();
                    if (this.options.minLock) {
                        this.date.setMinutes(0);
                    }
                    if (this.options.secondLock) {
                        this.date.setSeconds(0);
                        this.date.setMilliseconds(0);
                    }
                    this.viewDate = this.date;
                    this.fillDays();
                    if (this.format.hasDay) {
                        this.showView(0);
                    } else {
                        this.hideView();
                    }
                    this.pick('day');
                    break;
                case 'confirm':
                    var date = this.date;
                    this.trigger(EVENT_CONSOLE, {date: date});
                    this.setValue(date = this.formatDate(this.date));
                    this.hide();
                    break;
                    // No default
            }
        },

        clickDoc: function(e) {
            var target = e.target;
            var trigger = this.$trigger[0];
            var ignored;
            while (target !== document) {
                if (target === trigger) {
                    ignored = true;
                    break;
                }
                target = target.parentNode;
            }
            if (!ignored) {
                this.hide();
            }
        },

        keyup: function() {
            this.update();
        },

        getValue: function() {
            var $this = this.$element;
            var val = '';
            if (this.isInput) {
                val = $this.val();
            } else if (this.isInline) {
                if (this.options.container) {
                    val = $this.text();
                }
            } else {
                val = $this.text();
            }
            return val;
        },

        setValue: function(val) {
            var $this = this.$element;
            val = isString(val) ? val : '';
            $this.attr('time-val', val);
            if (this.options.timeShowLock) {
                if (this.isInput) {
                    $this.val(val);
                } else if (this.isInline) {
                    if (this.options.container) {
                        $this.text(val);
                    }
                } else {
                    $this.text(val);
                }
            }
        },


        // Methods
        // -------------------------------------------------------------------------

        // Show the timepicker
        show: function() {
            if (!this.isBuilt) {
                this.build();
            }
            if (this.isShown) {
                return;
            }
            if (this.trigger(EVENT_SHOW).isDefaultPrevented()) {
                return;
            }
            this.isShown = true;
            this.$picker.removeClass(CLASS_HIDE).on(EVENT_CLICK, $.proxy(this.click, this));
            this.showView(this.options.startView);
            if (!this.isInline) {
                $window.on(EVENT_RESIZE, (this._place = proxy(this.place, this)));
                $document.on(EVENT_CLICK, (this._clickDoc = proxy(this.clickDoc, this)));
                this.place();
            }
        },

        // Hide the timepicker
        hide: function() {
            this.destroy();
            if (!this.isShown) {
                return;
            }
            if (this.trigger(EVENT_HIDE).isDefaultPrevented()) {
                return;
            }
            this.isShown = false;
            this.$picker.addClass(CLASS_HIDE).off(EVENT_CLICK, this.click);
            if (!this.isInline) {
                $window.off(EVENT_RESIZE, this._place);
                $document.off(EVENT_CLICK, this._clickDoc);
            }
        },

        // Update the timepicker with the current input value
        update: function() {
            this.setDate(this.getValue(), true);
        },

        /**
         * Pick the current date to the element
         *
         * @param {String} _view (private)
         */
        pick: function(_view) {
            var $this = this.$element;
            var date = this.date;
            if (this.trigger(EVENT_PICK, {
                    view: _view || '',
                    date: date
                }).isDefaultPrevented()) {
                return;
            }            
        },

        // Reset the timepicker
        reset: function() {
            this.setDate(this.initialDate, true);
            this.setValue(this.initialValue);
            if (this.isShown) {
                this.showView(this.options.startView);
            }
        },

        /**
         * Get the month name with given argument or the current date
         *
         * @param {Number} month (optional)
         * @param {Boolean} short (optional)
         * @return {String} (month name)
         */
        getMonthName: function(month, short) {
            var options = this.options;
            var months = options.months;
            if ($.isNumeric(month)) {
                month = Number(month);
            } else if (isUndefined(short)) {
                short = month;
            }
            if (short === true) {
                months = options.monthsShort;
            }
            return months[isNumber(month) ? month : this.date.getMonth()];
        },

        /**
         * Get the day name with given argument or the current date
         *
         * @param {Number} day (optional)
         * @param {Boolean} short (optional)
         * @param {Boolean} min (optional)
         * @return {String} (day name)
         */
        getDayName: function(day, short, min) {
            var options = this.options;
            var days = options.days;
            if ($.isNumeric(day)) {
                day = Number(day);
            } else {
                if (isUndefined(min)) {
                    min = short;
                }
                if (isUndefined(short)) {
                    short = day;
                }
            }
            days = min === true ? options.daysMin : short === true ? options.daysShort : days;
            return days[isNumber(day) ? day : this.date.getDay()];
        },

        /**
         * Get the current date
         *
         * @param {Boolean} formated (optional)
         * @return {Date|String} (date)
         */
        getDate: function(formated) {
            var date = this.date;
            return formated ? this.formatDate(date) : new Date(date);
        },

        /**
         * Set the current date with a new date
         *
         * @param {Date} date
         * @param {Boolean} _isUpdated (private)
         */
        setDate: function(date, _isUpdated) {
            var filter = this.options.filter;
            if (isDate(date) || isString(date)) {
                date = this.parseDate(date);
                if ($.isFunction(filter) && filter.call(this.$element, date, options, 'date') === false) {
                    return;
                }
                this.date = date;
                this.viewDate = new Date(date);
                if (!_isUpdated) {
                    this.pick();
                }
                if (this.isBuilt) {
                    this.fillAll();
                }
            }
        },

        /**
         * Set the start view date with a new date
         *
         * @param {Date} date
         */
        setStartDate: function(date) {
            if (isDate(date) || isString(date)) {
                this.startDate = this.parseDate(date);

                if (this.isBuilt) {
                    this.fillAll();
                }
            }
        },

        /**
         * Set the end view date with a new date
         *
         * @param {Date} date
         */
        setEndDate: function(date) {
            if (isDate(date) || isString(date)) {
                this.endDate = this.parseDate(date);

                if (this.isBuilt) {
                    this.fillAll();
                }
            }
        },

        /**
         * Parse a date string with the set date format
         *
         * @param {String} date
         * @return {Date} (parsed date)
         */
        parseDate: function(date) {
            var format = this.format;
            var parts = [];
            var length;
            var year;
            var month;
            var day;
            var hour;
            var min;
            var second;
            var val;
            var i;

            if (isDate(date)) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), this.options.minLock ? '00' : date.getMinutes(), this.options.secondLock ? '00' : date.getSeconds());
            } else if (isString(date)) {
                parts = date.match(REGEXP_DIGITS) || [];
            }

            date = new Date();
            year = date.getFullYear();
            day = date.getDate();
            month = date.getMonth();
            hour = date.getHours();
            min = this.options.minLock ? 0 : date.getMinutes();
            second = this.options.secondLock ? 0 : date.getSeconds();
            length = format.parts.length;
            if (parts.length === length) {
                for (i = 0; i < length; i++) {
                    val = parseInt(parts[i], 10); //  || 1
                    switch (format.parts[i]) {
                        case 'ss':
                        case 's':
                            second = val;
                            break;
                        case 'mm':
                        case 'm':
                            min = val;
                            break;
                        case 'HH':
                        case 'H':
                            hour = val;
                            break;
                        case 'dd':
                        case 'd':
                            day = val;
                            break;
                        case 'MM':
                        case 'M':
                            month = val - 1;
                            break;
                        case 'yy':
                            year = 2000 + val;
                            break;
                        case 'yyyy':
                            year = val;
                            break;
                    }
                }
            }
            return new Date(year, month, day, hour, min, second);
        },

        /**
         * Format a date object to a string with the set date format
         *
         * @param {Date} date
         * @return {String} (formated date)
         */
        formatDate: function(date) {
            var format = this.format;
            var formated = '';
            var length;
            var year;
            var part;
            var val;
            var i;

            if (isDate(date)) {
                formated = format.source;
                year = date.getFullYear();
                val = {
                    s: date.getSeconds(),
                    m: date.getMinutes(),
                    H: date.getHours(),
                    d: date.getDate(),
                    M: date.getMonth() + 1,
                    yy: year.toString().substring(2),
                    yyyy: year
                };

                val.ss = (val.s < 10 ? '0' : '') + val.s;
                val.mm = (val.m < 10 ? '0' : '') + val.m;
                val.HH = (val.H < 10 ? '0' : '') + val.H;
                val.dd = (val.d < 10 ? '0' : '') + val.d;
                val.MM = (val.M < 10 ? '0' : '') + val.M;
                length = format.parts.length;

                for (i = 0; i < length; i++) {
                    part = format.parts[i];
                    formated = formated.replace(part, val[part]);
                }
            }
            return formated;
        },

        // Destroy the timepicker and remove the instance from the target element
        destroy: function() {
            this.unbind();
            this.unbuild();
            this.$element.removeData(NAMESPACE);
        }
    };

    timepicker.LANGUAGES = {};

    timepicker.DEFAULTS = {
        // Show the timepicker automatically when initialized
        autoshow: false,

        // Hide the timepicker automatically when picked
        autohide: false,

        // Pick the initial date automatically when initialized
        autopick: false,

        // Enable inline mode
        inline: false,

        // A element (or selector) for putting the timepicker
        container: null,

        // A element (or selector) for triggering the timepicker
        trigger: null,

        // The ISO language code (built-in: en-US)
        language: '',

        // The date string format
        format: 'yyyy-MM-dd HH:mm:ss',

        // The initial date
        date: null,

        // The start view date
        startDate: null,

        // The end view date
        endDate: null,

        // The start view when initialized
        startView: 0, // 0 for days, 1 for months, 2 for years

        // The start day of the week
        weekStart: 0, // 0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday, 4 for Thursday, 5 for Friday, 6 for Saturday

        // Show year before month on the timepicker header
        yearFirst: true,

        // A string suffix to the year number.
        yearSuffix: '年',

        // A string day to the year number.
        dateSuffix: '日',

        // Days' name of the week.
        days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

        // Shorter days' name
        daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

        // Shortest days' name
        daysMin: ['日', '一', '二', '三', '四', '五', '六'],

        // Months' name
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

        // Shorter months' name
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

        // A element tag for each item of years, months and days
        itemTag: 'li',

        // A class (CSS) for muted date item
        mutedClass: 'muted',

        // A class (CSS) for colon disabled date item
        colonClass: 'colon disabled',

        // A class (CSS) for picked date item
        pickedClass: 'picked',

        // A class (CSS) for disabled date item
        disabledClass: 'disabled',

        // minLock
        minLock: false,

        // secondLock
        secondLock: false,

        // input value
        timeShowLock: true,

        // The template of the timepicker
        template: (
            '<div class="timepicker-container">' +
            '<div class="timepicker-panel" data-view="years picker">' +
            '<ul>' +
            '<li data-view="years prev">&lsaquo;&lsaquo;</li>' +
            '<li data-view="years current"></li>' +
            '<li data-view="years next">&rsaquo;&rsaquo;</li>' +
            '</ul>' +
            '<ul data-view="years" class="years"></ul>' +
            '</div>' +
            '<div class="timepicker-panel" data-view="months picker">' +
            '<ul>' +
            '<li data-view="year prev">&lsaquo;&lsaquo;</li>' +
            '<li data-view="year current"></li>' +
            '<li data-view="year next">&rsaquo;&rsaquo;</li>' +
            '</ul>' +
            '<ul data-view="months" class="months"></ul>' +
            '</div>' +
            '<div class="timepicker-panel" data-view="days picker">' +
            '<ul>' +
            '<li data-view="month prev">&lsaquo;&lsaquo;</li>' +
            '<li data-view="month current"></li>' +
            '<li data-view="month next">&rsaquo;&rsaquo;</li>' +
            '</ul>' +
            '<ul data-view="week"></ul>' +
            '<ul data-view="days" class="days"></ul>' +
            '<ul data-view="times current" class="times">' +
            '</ul>' +
            '<ul class="confirm">' +
            '<li data-view="today">今天</li>' +
            '<li data-view="confirm">确定</li>' +
            '</ul>' +
            '</div>' +
            '<div class="timepicker-panel" data-view="times picker">' +
            '<ul>' +
            '<li class="colon disabled" data-view="days current"></li>' +
            '</ul>' +
            '<ul data-view="times" class="times"></ul>' +
            '</div>' +
            '</div>'
        ),

        // The offset top or bottom of the timepicker from the element
        offset: 10,

        // The `z-index` of the timepicker
        zIndex: 2016,

        maxTime: '',
        minTime: '',

        // Filter each date item (return `false` to disable a date item)
        filter: function(date, options, type) {

            var maxTimeId = options.maxTime;
            var minTimeId = options.minTime;
            var maxTime, minTime;

            if (maxTimeId) {
                var $maxTime = $('#' + maxTimeId);
                maxTime = $maxTime.attr('time-val') || $maxTime.val() || $maxTime.text();
                maxTime = toDate(maxTime);
                if (date.getTime() >= maxTime.getTime()) {
                    return isDisabled(type, date, maxTime);
                }
                return true;
            } else if (minTimeId) {
                var $minTime = $('#' + minTimeId);
                minTime = $minTime.attr('time-val') || $minTime.val() || $minTime.text();
                minTime = toDate(minTime);
                // console.info(date, minTime);
                if (date.getTime() <= minTime.getTime()) {
                    return isDisabled(type, date, minTime);
                }
                return true;
            } else if (maxTimeId && minTimeId) {
                // var $maxTime = $('#' + maxTimeId);
                // var $minTime = $('#' + minTimeId);
                // maxTime = $maxTime.attr('time-val') || $maxTime.val() || $maxTime.text();
                // minTime = $minTime.attr('time-val') || $minTime.val() || $minTime.text();
                // maxTime = toDate(maxTime);
                // minTime = toDate(minTime);
                // if (date.getTime() >= maxTime.getTime() && date.getTime() <= minTime.getTime()) {
                //     if (type === 'day' && ((date.getDate() === maxTime.getDate()) || (date.getDate() === minTime.getDate()))) {
                //         return true;
                //     }
                //     if (type === 'month' && ((date.getDate() === maxTime.getDate()) || (date.getDate() === minTime.getDate()))) {
                //         return true;
                //     }
                //     return false;
                // }
                // return true;
            } 

            function isDisabled(type, date, tempDate){
                switch (type) {
                    case 'year': 
                        if (date.getFullYear() === tempDate.getFullYear()) {
                            return true;
                        }
                        return false;
                        break;
                    case 'month': 
                        if ((date.getFullYear() === tempDate.getFullYear()) && (date.getMonth() === tempDate.getMonth())) {
                            return true;
                        }
                        return false;
                        break;
                    case 'day': 
                        if ((date.getFullYear() === tempDate.getFullYear()) && (date.getMonth() === tempDate.getMonth()) && (date.getDate() === tempDate.getDate())) {
                            return true;
                        }
                        return false;
                        break;
                    case 'hour': 
                        if ((date.getFullYear() === tempDate.getFullYear()) && (date.getMonth() === tempDate.getMonth()) && (date.getDate() === tempDate.getDate()) && (date.getHours() === tempDate.getHours())) {
                            return true;
                        }
                        return false;
                        break;
                    case 'min': 
                        if ((date.getFullYear() === tempDate.getFullYear()) && (date.getMonth() === tempDate.getMonth()) && (date.getDate() === tempDate.getDate()) && (date.getHours() === tempDate.getHours()) && (date.getMinutes() === tempDate.getMinutes())) {
                            return true;
                        }
                        return false;
                        break;
                    case 'second': 
                        if ((date.getFullYear() === tempDate.getFullYear()) && (date.getMonth() === tempDate.getMonth()) && (date.getDate() === tempDate.getDate()) && (date.getHours() === tempDate.getHours()) && (date.getMinutes() === tempDate.getMinutes()) && (date.getSeconds() === tempDate.getSeconds())) {
                            return true;
                        }
                        return false;
                        break;
                    default:
                        return false;
                }
            }

            function toDate(timeStr){
                timeStr = timeStr.replace(new RegExp('[:;_-\\s+\/]', 'g'), '');
                var year = timeStr.substring(0, 4);
                var month = timeStr.substring(4, 6);
                var date = timeStr.substring(6, 8);
                var hour = timeStr.substring(8, 10);
                var min = timeStr.length > 10 ? timeStr.substring(10, 12) : '00';
                var second = timeStr.length > 12 ? timeStr.substring(12, 14) : '00';
                return new Date(year, month - 1, date, hour, min, second);
            }
            
        },

        // Event shortcuts
        show: null,
        hide: null,
        pick: null
    };

    timepicker.setDefaults = function(options) {
        $.extend(timepicker.DEFAULTS, $.isPlainObject(options) && options);
    };

    // Save the other timepicker
    timepicker.other = $.fn.timepicker;

    // Register as jQuery plugin
    $.fn.timepicker = function(option) {
        var args = toArray(arguments, 1);
        var result;
        this.each(function() {
            var $this = $(this);
            var data = $this.data(NAMESPACE);
            var options;
            var fn;
            if (!data) {
                if (/destroy/.test(option)) {
                    return;
                }
                options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
                $this.data(NAMESPACE, (data = new timepicker(this, options)));
            }
            if (isString(option) && $.isFunction(fn = data[option])) {
                result = fn.apply(data, args);
            }
        });
        return isUndefined(result) ? this : result;
    };

    $.fn.timepicker.Constructor = timepicker;
    $.fn.timepicker.languages = timepicker.LANGUAGES;
    $.fn.timepicker.setDefaults = timepicker.setDefaults;

    // No conflict
    $.fn.timepicker.noConflict = function() {
        $.fn.timepicker = timepicker.other;
        return this;
    };

});
