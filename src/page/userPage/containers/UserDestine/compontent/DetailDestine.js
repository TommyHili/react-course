import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Motion, spring } from 'react-motion'
import Utils from 'utils/utils'

import './detailDestine.less'

const springConfig = {stiffness: 800, damping: 50}
const detailPageCover = {h: 200, w: 280, top: 60, left: (window.innerWidth - 280)/2, }
const detailPageBox = {h: 400, w: window.innerWidth - 50, top: 110, left: 25 }

export default class FakeModel extends React.Component {

    constructor(props) {
      super(props)

      this.closeDetailPage = this.closeDetailPage.bind(this)
      this.handleMotionEnd = this.handleMotionEnd.bind(this)
      this.updateDetail = this.updateDetail.bind(this)
      this.cancelAppointment = this.cancelAppointment.bind(this)

      this.state = {
        close: false,
        courseData: {},
      }
    }

    componentWillMount() {

    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   return true
    // }

    componentWillReceiveProps(nextProps) {
      if(nextProps.show) {
        this.updateDetail(nextProps)
      }
    }

    updateDetail(nextProps) {
      // setTimeout 是为了模拟 http 请求
      setTimeout(() => {
        this.setState({
          courseData: nextProps.courseDetail
        })
      }, 300)
    }

    handleMotionEnd() {
      if(this.state.close) {
        this.props.closeDetail()
        this.state.close = false
      }
    }

    cancelAppointment() {
      this.props.cancelAppointment(this.props.courseDetail.id).then(res => {
        this.closeDetailPage()
      })
    }

    closeDetailPage() {
      this.setState({
        close: true,
        courseData: {},
      })

      setTimeout(() => {
        this.handleMotionEnd()
      }, 300)
    }

    render() {

      let { show, info } = this.props
      let { close, courseData } = this.state

      if(show) {

        let coverClientTop = info.coverClient.y | info.coverClient.top
        let coverClientLeft = info.coverClient.x | info.coverClient.left
        let boxClientTop = info.boxClient.y | info.boxClient.top
        let boxClientLeft = info.boxClient.x | info.boxClient.left

        let coverStyle = {
          top: coverClientTop,
          left: coverClientLeft,
          height: info.coverClient.height,
          width: info.coverClient.width,
        }

        let infoStyle = {
          top: boxClientTop,
          left: boxClientLeft,
          height: info.boxClient.height,
          width: info.boxClient.width,
        }

        let coverSpring = close ? {
          top: spring(coverClientTop, springConfig),
          left: spring(coverClientLeft, springConfig),
          height: spring(info.coverClient.height, springConfig),
          width: spring(info.coverClient.width, springConfig),
        } : {
          top: spring(detailPageCover.top, springConfig),
          left: spring(detailPageCover.left, springConfig),
          height: spring(detailPageCover.h, springConfig),
          width: spring(detailPageCover.w, springConfig),
        }

        let infoSpring = close ? {
          top: spring(boxClientTop, springConfig),
          left: spring(boxClientLeft, springConfig),
          height: spring(info.boxClient.height, springConfig),
          width: spring(info.boxClient.width, springConfig),
        } : {
          top: spring(detailPageBox.top, springConfig),
          left: spring(detailPageBox.left, springConfig),
          height: spring(detailPageBox.h, springConfig),
          width: spring(detailPageBox.w, springConfig),
        }

        return(
          <section className={classnames('destine-detail-layer', {'close-transition': close})}>
            <Motion defaultStyle={coverStyle}  style={coverSpring}>
              {
                ({top, left, height, width}) => <div className="detail-cover" style={{
                  top,
                  left,
                  height,
                  width,
                  backgroundImage: info.coverImage,
                }}></div>
              }
            </Motion>
            <Motion defaultStyle={infoStyle}  style={infoSpring} onRest={()=>{}}>
              {
                ({top, left, height, width}) => <div className="detail-box" style={{
                  top,
                  left,
                  height,
                  width
                }}></div>
              }
            </Motion>
            <div className={classnames("detail-contnet", {"show-content": courseData.course_name})} style={{top: detailPageCover.top + detailPageCover.h}}>
              <div className="dt-title">{courseData.course_name}</div>
              <div className="dt-date"><i className="icon-clock"></i>{Utils.getWeek(courseData.course_date_start)} {Utils.format('hh:mm', courseData.course_date_start)} - {Utils.format('hh:mm', courseData.course_date_end)}</div>
              <p className="dt-desc">{courseData.course_introduce}</p>
              <div className="dt-button" onClick={this.cancelAppointment}>取消预约</div>
            </div>
            <div onClick={this.closeDetailPage} className="destine-detail-bg"></div>
          </section>
        )
      } else {
        return(
          <section></section>
        )
      }
    }
}

FakeModel.propTypes = {
  show: PropTypes.bool,
  info: PropTypes.object,
  closeDetail: PropTypes.func,
  courseDetail: PropTypes.object,
  cancelAppointment: PropTypes.func,
}