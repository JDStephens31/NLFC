/* New Life Family Church — events calendar

   ===== To add an event, copy a line into SPECIAL_EVENTS below. =====
   date:  'YYYY-MM-DD'
   time:  shown as written, e.g. '6:00 PM' (leave '' for all-day)
   title: the event name
   note:  optional short description
   short: optional shorter name for the small calendar squares

   Weekly services (WEEKLY) show up automatically every week. To skip one —
   say, no Bible study the night before Thanksgiving — add its date to CANCELLED. */
(function () {
  'use strict';

  var WEEKLY = [
    { day: 0, time: '10:00 AM', title: 'Sunday Worship', short: 'Worship', note: 'Music, prayer, and a message from God\'s Word.' },
    { day: 3, time: '7:00 PM',  title: 'Wednesday Bible Study', short: 'Bible Study', note: 'Digging deeper into Scripture together.' }
  ];

  var SPECIAL_EVENTS = [
    // { date: '2026-12-24', time: '6:00 PM', title: 'Christmas Eve Candlelight Service', note: 'Bring the whole family.' },
  ];

  var CANCELLED = [
    // '2026-11-25'
  ];

  /* ---------------------------------------------------------------------- */
  var root = document.querySelector('[data-calendar]');
  if (!root) return;

  var grid = root.querySelector('[data-cal-grid]');
  var title = root.querySelector('[data-cal-title]');
  var list = document.querySelector('[data-cal-list]');
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var key = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };

  // Sort "6:00 PM" style times; all-day events go first.
  var minutes = function (t) {
    var m = /(\d+):(\d+)\s*(AM|PM)/i.exec(t || '');
    if (!m) return -1;
    return (+m[1] % 12 + (m[3].toUpperCase() === 'PM' ? 12 : 0)) * 60 + +m[2];
  };

  var eventsOn = function (d) {
    var k = key(d);
    var out = [];
    if (CANCELLED.indexOf(k) === -1) {
      WEEKLY.forEach(function (e) { if (e.day === d.getDay()) out.push(e); });
    }
    SPECIAL_EVENTS.forEach(function (e) {
      if (e.date === k) out.push({ time: e.time, title: e.title, short: e.short, note: e.note, special: true });
    });
    return out.sort(function (a, b) { return minutes(a.time) - minutes(b.time); });
  };

  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  };

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);

  var render = function () {
    var y = view.getFullYear();
    var m = view.getMonth();
    title.textContent = MONTHS[m] + ' ' + y;
    grid.textContent = '';

    var lead = new Date(y, m, 1).getDay();
    var days = new Date(y, m + 1, 0).getDate();

    for (var i = 0; i < lead; i++) grid.appendChild(el('li', 'calendar__day calendar__day--blank'));

    for (var d = 1; d <= days; d++) {
      var date = new Date(y, m, d);
      var events = eventsOn(date);
      var cell = el('li', 'calendar__day');
      if (date < today) cell.classList.add('is-past');
      if (date.getTime() === today.getTime()) cell.classList.add('is-today');
      cell.setAttribute('aria-label', DAYS[date.getDay()] + ' ' + MONTHS[m] + ' ' + d +
        (events.length ? ': ' + events.map(function (e) { return e.title + (e.time ? ' ' + e.time : ''); }).join(', ') : ''));

      cell.appendChild(el('span', 'calendar__num', String(d)));
      events.forEach(function (e) {
        var tag = el('span', 'calendar__event' + (e.special ? ' calendar__event--special' : ''));
        if (e.time) tag.appendChild(el('span', 'calendar__time', e.time));
        tag.appendChild(document.createTextNode(e.short || e.title));
        cell.appendChild(tag);
      });
      grid.appendChild(cell);
    }
  };

  // The next few weeks of events, from today on.
  var renderList = function () {
    if (!list) return;
    list.textContent = '';
    var shown = 0;
    for (var i = 0; i < 120 && shown < 6; i++) {
      var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      eventsOn(date).forEach(function (e) {
        if (shown >= 6) return;
        var li = el('li', 'event-item' + (e.special ? ' event-item--special' : ''));
        var badge = el('span', 'event-item__date');
        badge.appendChild(el('span', 'event-item__mon', MONTHS[date.getMonth()].slice(0, 3)));
        badge.appendChild(el('span', 'event-item__dnum', String(date.getDate())));
        var body = el('span', 'event-item__body');
        body.appendChild(el('strong', '', e.title));
        body.appendChild(el('span', '', DAYS[date.getDay()] + (e.time ? ' · ' + e.time : '')));
        if (e.note) body.appendChild(el('span', 'event-item__note', e.note));
        li.appendChild(badge);
        li.appendChild(body);
        list.appendChild(li);
        shown++;
      });
    }
  };

  root.querySelector('[data-cal-prev]').addEventListener('click', function () {
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    render();
  });
  root.querySelector('[data-cal-next]').addEventListener('click', function () {
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    render();
  });

  render();
  renderList();
})();
