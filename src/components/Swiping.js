import React from "react";

class Swiping extends React.Component {
  // DOM Refs
  listElement;
  wrapper;
  background;

  // Drag & Drop
  dragStartX = 0;
  left = 0;
  dragged = false;
  moved = false;

  // FPS Limit
  startTime;
  fpsInterval = 1000 / 60;

  constructor(props) {
    super(props);

    this.listElement = null;
    this.wrapper = null;
    this.background = null;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onDragStartMouse = this.onDragStartMouse.bind(this);
    this.onDragStartTouch = this.onDragStartTouch.bind(this);
    this.onDragEndMouse = this.onDragEndMouse.bind(this);
    this.onDragEndTouch = this.onDragEndTouch.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.clickedDelete = this.clickedDelete.bind(this);

    this.onSwiped = this.onSwiped.bind(this);
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.onDragEndMouse);
    window.addEventListener("touchend", this.onDragEndTouch);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onDragEndMouse);
    window.removeEventListener("touchend", this.onDragEndTouch);
  }

  onDragStartMouse(evt) {
    this.onDragStart(evt.clientX);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  onDragStartTouch(evt) {
    const touch = evt.targetTouches[0];
    this.onDragStart(touch.clientX);
    window.addEventListener("touchmove", this.onTouchMove);
  }

  onDragStart(clientX) {
    this.dragged = true;
    this.moved = false;
    this.dragStartX = clientX;
    this.listElement.className = "Swipe__item";
    this.startTime = Date.now();
    requestAnimationFrame(this.updatePosition);
  }

  onDragEndMouse(evt) {
    window.removeEventListener("mousemove", this.onMouseMove);
    this.onDragEnd();
  }

  onDragEndTouch(evt) {
    window.removeEventListener("touchmove", this.onTouchMove);
    this.onDragEnd();
  }

  onDragEnd() {
    if (this.dragged) {
      this.dragged = false;

      const threshold = this.props.threshold || 0.3;

      if (this.left < this.listElement.offsetWidth * threshold * -1) {
        this.left = -75;
      } else {
        this.left = 0;
      }

      if ( this.listElement ) {
        this.listElement.className = "Swipe__item Swipe__item--bouncing";
        this.listElement.style.transform = `translateX(${this.left}px)`;
      }
    }
  }

  clickedDelete = (event) => {
    if (!this.dragged) {
      this.onSwiped();
    }
  }

  onMouseMove(evt) {
    this.moved = true;
    const left = evt.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  }

  onTouchMove(evt) {
    this.moved = true;
    const touch = evt.targetTouches[0];
    const left = touch.clientX - this.dragStartX;
    if (left < 0) {
      this.left = left;
    }
  }

  updatePosition() {
    if (this.dragged) requestAnimationFrame(this.updatePosition);

    const now = Date.now();
    const elapsed = now - this.startTime;

    if (this.dragged && elapsed > this.fpsInterval) {
      this.listElement.style.transform = `translateX(${this.left}px)`;

      const opacity = (Math.abs(this.left) / 100).toFixed(2);
      if (opacity < 1 && opacity.toString() !== this.background.style.opacity) {
        this.background.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        this.background.style.opacity = "1";
      }

      this.startTime = Date.now();
    }
  }

  onClicked() {    
    if ( !this.moved ) {
        if ( this.props.onClick ) {
          this.props.onClick(this.listElement.getAttribute("name")); 
        }
    }
  }

  onSwiped() {
      if ( this.moved ) {
        const isDeleted = this.props.onDelete(this.listElement.getAttribute("name")); 
        if ( isDeleted ) {
          this.wrapper.style.maxHeight = 0;
        }
      }
  }

  render() {
    return (
      <>
        <div className="Swipe__wrapper" ref={div => (this.wrapper = div)} onMouseDown={this.clickedDelete}>
          <div ref={div => (this.background = div)} className="Swipe__background" >
            <div className="delete-icon"><i className="fas fa-trash-alt"></i></div>
          </div>
          <div
            name={this.props.name}
            onClick={this.onClicked}
            ref={div => (this.listElement = div)}
            onMouseDown={this.onDragStartMouse}
            onTouchStart={this.onDragStartTouch}
            className="Swipe__item"
          >
            {this.props.children}
          </div>
        </div>
      </>
    );
  }
}

export default Swiping;