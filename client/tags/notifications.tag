notifications
  .notification(each='{ notification in notifications }' onclick='{ notificationClicked }' class='slideUp')
    p { notification.text }

  style(scoped).
    :scope {
      display: block;
      width: 250px;
      position: absolute;
      bottom: 20px;
      left: 50%;
      z-index: 1;
      margin-left: -125px;
      text-align: center;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
    }

    .notification {
      margin-bottom: 10px;
      padding: 12px;
      background: #7ccaea;
      color: #fff;
      border-radius: 2px;
      cursor: pointer;
    }

    .notification p {
      margin: 0;
    }

  script(type='babel').
    this.mixin('redux')

    this.timers = {}

    import { removeNotification } from '../../actions/notifications'
    this.dispatchify({ removeNotification })

    this.subscribe((state) => {
      return {
        notifications: state.notifications.messages
      }
    })

    this.on('updated', () => {
      if (this.parent.userInactive) {
        return
      }

      this.notifications.forEach((notification) => {
        if (!this.timers[notification.id]) {
          this.timers[notification.id] = window.setTimeout(() => {
            this.removeNotification(notification.id)
          }, 4000)
        }
      })
    })

    this.notificationClicked = (e) => {
      this.removeNotification(e.item.notification.id)
    }
