(function (w) {
  w.carouselElement = function (imgArr) {
    var carousel = document.querySelector('.carousel')
    if (carousel) {
      creatCarousel(imgArr)
    }
    function creatCarousel(arr) {
      var carouselList = document.querySelector('.carousel > .carouselList')
      var carouselLoop = !(carousel.getAttribute('carouselLoop') === null)
      var carouselPoints = !(carousel.getAttribute('carouselPoints') === null)
      var carouselAuto = !(carousel.getAttribute('carouselAuto') === null)
      var arrLength = arr.length
      var navPoints = null
      var touchStartX = 0
      var elementStart = 0
      var index = 0
      var moveX = 0
      var carouselTimer = null
      var touchstartY = 0
      var isX = true
      var isFirst = true

      // 自动轮播
      if (carouselAuto) {
        autoPlay()
      }

      //生成li
      if (carouselLoop) {
        arr = arr.concat(arr)
      }
      carouselList.style.width = arr.length * 100 + '%'
      for (var i = 0; i < arr.length; i++) {
        var liNew = document.createElement('li')
        liNew.style.width = 1 / arr.length * 100 + '%'
        liNew.innerHTML = '<li><a href="javascript:;"><img src="img/' + arr[i] + '"></a></li>'
        carouselList.appendChild(liNew)
      }


      // 生成导航点
      if (carouselPoints) {
        var pointsWrap = document.createElement('div')
        pointsWrap.classList.add('pointsWrap')
        for (var i = 0; i < arrLength; i++) {
          var point = document.createElement('span')
          if (i === 0) {
            point.classList.add('active')
          }
          pointsWrap.appendChild(point)
        }
        carousel.appendChild(pointsWrap)
        navPoints = document.querySelectorAll('.carousel > .pointsWrap span')
      }


      //切屏
      carousel.addEventListener('touchstart', function (ev) {
        isX = true
        isFirst = true
        clearInterval(carouselTimer)
        carouselList.style.transition = 'none'
        if (carouselLoop) {
          if (index === 0) {
            index = 5
            css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
          }
          if (index === 9) {
            index = 4
            css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
          }
        }
        ev = ev || event
        var touch = ev.changedTouches[0]
        touchStartX = touch.clientX
        touchstartY = touch.clientY
        elementStart = css(carouselList, 'translateX')
      })

      carousel.addEventListener('touchmove', function (ev) {
        if(!isX){
          return
        }
        ev = ev || event
        var touch = ev.changedTouches[0]
        moveX = touch.clientX - touchStartX
        moveY = touch.clientY - touchstartY
        if(isFirst && Math.abs(moveY) > Math.abs(moveX)){
          isFirst = false
          isX = false
          return
        }
        css(carouselList, 'translateX', elementStart + moveX)
      })

      carousel.addEventListener('touchend', function () {
        index = css(carouselList, 'translateX') / document.documentElement.clientWidth
        if (moveX < 0) {
          // index -= .2
          index = -Math.round(index)
        } else {
          // index += .2
          index = -Math.ceil(index)
        }
        if (!carouselLoop) {
          if (index < 0) {
            index = 0
          }
          if (index > arr.length - 1) {
            index = arr.length - 1
          }
        }
        carouselList.style.transition = '.5s transform'
        changePage(index)
        setTimeout(autoPlay, 1000)
      })


      // 轮播函数
      // function autoPlay() {
      //   clearInterval(carouselTimer)
      //   carouselTimer = setInterval(function () {
      //     if(index===arr.length - 1){
      //       index = arrLength - 1
      //       carouselList.style.transition = 'none'
      //       css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
      //     }
      //     index++
      //     if (index === arrLength && !carouselLoop) {
      //       index = 0
      //       carouselList.style.transition = 'none'
      //       changePage(index)
      //     }
      //     if (carouselLoop) {
      //       if(index > arrLength){
      //           css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
      //           carouselList.addEventListener('transitionend',loopControl2)
      //       }
      //       else {
      //         carouselList.removeEventListener('transitionend',loopControl2)
      //       }
      //       if(index === arrLength){
      //         carouselList.addEventListener('transitionend',loopControl)
      //       }
      //       setInterval(function () {
      //         carouselList.removeEventListener('transitionend',loopControl)
      //       },1000)
      //       // else {
      //       //   carouselList.removeEventListener('transitionend',loopControl)
      //       // }
      //     }
      //     setTimeout(function () {
      //       carouselList.style.transition = '.8s transform'
      //       changePage(index)
      //     }, 50)
      //   }, 1200)
      // }


      var flag = true
      function autoPlay() {
        clearInterval(carouselTimer)
        carouselTimer = setInterval(function () {
          if(carouselLoop){
            if (index === 0 || flag) {
              index = 5
              carouselList.style.transition = 'none'
              css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
              flag = false
            }
            if (index === 9) {
              index = 4
              carouselList.style.transition = 'none'
              css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
            }
          }
          index++
          if (index === arrLength && !carouselLoop) {
            index = 0
            carouselList.style.transition = 'none'
            changePage(index)
          }
          setTimeout(function () {
            carouselList.style.transition = '.8s transform'
            changePage(index)
          }, 200)
        },1200)
      }


      //切屏函数
      function changePage(index) {
        css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
        if (navPoints) {
          for (var i = 0; i < arrLength; i++) {
            navPoints[i].classList.remove('active')
          }
          navPoints[index % 5].classList.add('active')
        }
      }

      function loopControl() {
        carouselList.style.transition = 'none'
        index = 0
        css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
      }
      function loopControl2() {
        carouselList.style.transition = 'none'
        index = index % arrLength
        css(carouselList, 'translateX', -index * document.documentElement.clientWidth)
      }

    }
  }
})(window)

