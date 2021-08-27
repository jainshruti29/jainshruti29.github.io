var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 300 - Math.random() * 100;
  
    if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
  };

  function qs(selector, all = false) {
    return all
      ? document.querySelectorAll(selector)
      : document.querySelector(selector);
  }
  
  const sections = qs(".section", true);
  const experience_timeline = qs(".experience_timeline");
  const line = qs(".line");
  line.style.bottom = `calc(100% - 20px)`;
  let prevScrollY = window.scrollY;
  let up, down;
  let full = false;
  let set = 0;
  const targetY = window.innerHeight * 0.8;
  
  function scrollHandler(e) {
    const { scrollY } = window;
    up = scrollY < prevScrollY;
    down = !up;
    const experience_timelineRect = experience_timeline.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect(); // const lineHeight = lineRect.bottom - lineRect.top;
  
    const dist = targetY - experience_timelineRect.top;
    console.log(dist);
  
    if (down && !full) {
      set = Math.max(set, dist);
      line.style.bottom = `calc(100% - ${set}px)`;
    }
  
    if (dist > experience_timeline.offsetHeight + 50 && !full) {
      full = true;
      line.style.bottom = `-50px`;
    }
  
    sections.forEach((item) => {
      // console.log(item);
      const rect = item.getBoundingClientRect(); //     console.log(rect);
  
      if (rect.top + item.offsetHeight / 5 < targetY) {
        item.classList.add("show-me");
      }
    }); // console.log(up, down);
  
    prevScrollY = window.scrollY;
  }
  
  scrollHandler();
  line.style.display = "block";
  window.addEventListener("scroll", scrollHandler);