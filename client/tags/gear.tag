gear
  a.trigger(href='#' onclick='{ openSettings }') { user.name }

  form(onsubmit='{ updateSettings }' class='{ show: showSettings }')
    div
      label(for='menu-username') Your name
      input(type='text' name='menu-username' id='menu-username' value='{ user.name }' required)

    div(if='{ user.pm }')
      label(for='menu-points') Available points
      input(
        type='textfield'
        name='menu-points'
        id='menu-points'
        title='Please enter comma-separated values'
        pattern='^([\\d\\w]+(, ?[\\d\\w]+)*)?$'
        value='{ availablePoints }',
        disabled='{ round.active }'
        autocomplete='off'
        required
      )

    div.actions
      button(type='submit') Save

  style(scoped).
    :scope {
      display: block;
      position: absolute;
      top: 5px;
      right: 5px;
      z-index: 1;
      background: #fff;
      text-align: right;
    }

    input {
      width: 150px;
      padding: 5px;
      font-size: 1em;
    }

    input:invalid {
      border-color: #da0000;
    }

    .trigger {
      display: inline-block;
      padding: 10px 28px 10px 0;
      background: url(/assets/images/icons/gear.svg) no-repeat right center;
      background-size: 20px;
      transition: transform .2s ease;
    }

    form > div + div {
      margin-top: 10px;
    }

    form button {
      font-size: 1em;
    }

    form input {
      width: auto;
    }

    form .actions {
      margin-top: 10px;
    }

  script(type='babel').
    this.mixin('redux')

    import { setName, setPoints } from '../../actions/server'
    this.dispatchify({ setName, setPoints })

    this.subscribe((state) => {
      return {
        user: state.user,
        round: state.round
      }
    })

    this.on('update', () => {
      this.availablePoints = this.round.points.join(',')
    })

    this.openSettings = (e) => {
      this.showSettings = !this.showSettings
    }

    this.updateSettings = (e) => {
      const nextName = this['menu-username'].value
      const nextPoints = this['menu-points'].value

      if (nextName !== this.user.name) {
        this.setName(nextName)
      }

      if (nextPoints !== this.availablePoints) {
        this.setPoints(nextPoints.split(/, ?/))
      }

      this.showSettings = false
    }

