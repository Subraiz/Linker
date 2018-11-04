import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from "react-native";

const screeWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const swipeThreshold = 0.32 * screeWidth;
const swipeOutDuration = 400;

class Deck extends Component {
  constructor(props) {
    super(props);
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.shouldSetPanResponder,
      onPanResponderMove: (e, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > swipeThreshold) {
          this.forceSwipe("right");
        } else if (gesture.dx < -swipeThreshold) {
          this.forceSwipe("left");
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position, };
    this.shouldSetPanResponder = this.shouldSetPanResponder.bind(this);
  }

  shouldSetPanResponder() {
    return !this.props.showMore;
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  forceSwipe(direction) {
    const directionWeight = direction === "right" ? 1.5 : -1.5;
    Animated.timing(this.state.position, {
      toValue: { x: directionWeight * screeWidth, y: 0 },
      duration: swipeOutDuration
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[0];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    this.state.position.setValue({ x: 0, y: 0 });
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-screeWidth * 2.5, 0, screeWidth * 2.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate: rotate }]
    };
  }

  renderCards() {
    console.log("render");
    console.log(this.props.data.length);
    if (this.props.data.length === 0) {
      return (
        <Animated.View style={styles.cardStyle}>
          {this.props.renderNoMoreCards()}
        </Animated.View>
      );
    }

    if (this.props.data.length === 1) {
      return [
        (
          <Animated.View style={styles.cardStyle}>
            {this.props.renderNoMoreCards()}
          </Animated.View>
        ), (
          <Animated.View
            key={this.props.data[0].getUid()}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(this.props.data[0])}
          </Animated.View>
        )
      ];
    }

    console.log("long");
    return this.props.data
      .map((candidate, i) => {
        if (i === 0) {
          return (
            <Animated.View
              key={candidate.uid}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.state.panResponder.panHandlers}
            >
              {this.props.renderCard(candidate)}
            </Animated.View>
          );
        }
        if (i === 1) {
          // Return Animated.View for rendering purposed
          return (
            <Animated.View
              key={candidate.id}
              style={[styles.cardStyle, styles.nextCardStyle]}
            >
              {this.props.renderCard(candidate)}
            </Animated.View>
          );
        }
      }).reverse();
  }
  render() {
    if (this.props.forceSwipe) {
      this.forceSwipe(this.props.forceSwipe);
    }
    return (
      <View>
        <View style={styles.deckContainer}>{this.renderCards()}</View>
      </View>
    );
  }
}

Deck.defaultProps = {
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
  renderNoMoreCards: () => {}
};

const styles = {
  deckContainer: {
    display: "flex",
    alignItems: "center"
  },
  cardStyle: {
    position: "absolute",
    width: screeWidth
  },
  nextCardStyle: {
    selfAlign: "center",
    width: screeWidth - 10,
    top: screenHeight / 90,
    opacity: 0.95
  },
  likeButton: {
    display: "flex",
    alignItems: "center",
    height: screenHeight * 0.9,
    width: screeWidth
  },
  dislikeButton: {
    position: "absolute",
    width: screeWidth * 0.25,
    height: screenHeight * 0.9
  }
};

export default Deck;
