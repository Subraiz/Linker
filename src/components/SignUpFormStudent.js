import React, { Component } from "react";
import {
  Text,
  View,
  Picker,
  KeyboardAvoidingView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  ScrollView
} from "react-native";
import {
  SearchBar,
  FormLabel,
  FormInput,
  FormValidationMessage,
  ButtonGroup
} from "react-native-elements";
import Error from "../common/Error";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateUser, registerUser } from "../actions/LoginActions";

let nationalSchools = [
  "Amherst",
  "Boston College",
  "Boston University",
  "Harvard",
  "Massachussets Institute of Technology",
  "Babson",
  "Northeastern",
  "Rutgers",
  "Tufts",
  "Emerson"
];

nationalSchools = nationalSchools.sort();

class SignUpFormStudent extends Component {
  state = {
    schools: nationalSchools,
    skills: [],
    skillTitle: "",
    errors: {}
  };

  submitButton() {
    let errors = {};
    let errored = false;

    if (!this.props.school || this.props.school.length < 4) {
      errors.name = "Please select a valid school!";
      errored = true;
    }

    if (!this.props.gpa || this.props.gpa.length || isNaN(this.props.gpa)) {
      errors.gpa = "Please provide a valid gpa!";
      errored = true;
    } else {
      let gpa = Number(this.props.gpa);
      if (gpa > 5 || gpa < 1) {
        errors.gpa = "Please provide a valid gpa!";
        errored = true;
      }
    }

    if (!this.props.major || this.props.major.length < 2) {
      errors.major = "Please provide a valid major!";
      errored = true;
    }

    if (!this.props.email || this.props.email.length < 6) {
      errors.email = "Please provide a valid email!";
      errored = true;
    }

    if (!this.props.about || this.props.about.length < 20) {
      errors.about = "Please provide a valid description!";
      errored = true;
    }

    if (errored) {
      this.setState({ errors });
    } else {
      this.props.registerUser(this.props.user);
    }
  }

  updatedSkills(text) {
    this.setState({ skillTitle: text });

    let updatedSkills = [];
    text.trim();
    if (text.substring(text.length - 1) == ",") {
      updatedSkills = this.state.skills;
      updatedSkills.push(this.state.skillTitle);
      this.setState({ skills: updatedSkills, skillTitle: "" });
      this.props.updateUser({ prop: "skills", value: this.state.skills });
    }
  }

  componentDidUpdate(props) {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  renderSearchedSchools(e) {
    let newSchools = [];
    nationalSchools.forEach(school => {
      if (school.includes(e)) {
        newSchools.push(school);
      }
    });
    console.log(newSchools);
    this.setState({ schools: newSchools });
  }

  renderLabels(array) {
    return array.map(item => {
      return <Picker label={item} value={item} key={item} />;
    });
  }

  removeSkill(i) {
    let updatedPositions = this.state.skills.splice(i, 1);
    this.setState(updatedPositions);
  }

  renderSkills() {
    return this.state.skills.map((position, i) => {
      return (
        <TouchableOpacity
          key={position}
          onLongPress={this.removeSkill.bind(this, i)}
        >
          <View style={styles.skillContainer}>
            <Text>{position}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    const { errors } = this.state;
    return (
      <ScrollView style={styles.containerStyle}>
        <SearchBar
          showLoading
          placeholder="Search For School"
          onChangeText={this.renderSearchedSchools.bind(this)}
        />

        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={true}
        >
          <Picker
            style={{ width: 300, alignSelf: "center" }}
            selectedValue={this.props.school || "Boston College"}
            onValueChange={school =>
              this.props.updateUser({
                prop: "school",
                value: school || "Boston College"
              })
            }
          >
            {this.renderLabels(this.state.schools)}
          </Picker>
          <Error value={errors.school} />
          <FormLabel>Major</FormLabel>
          <FormInput
            onChangeText={text => {
              this.props.updateUser({ prop: "major", value: text });
            }}
          />
          <Error value={errors.major} />
          <FormLabel>GPA</FormLabel>
          <FormInput
            keyboardType="numeric"
            onChangeText={text => {
              this.props.updateUser({ prop: "gpa", value: text });
            }}
          />
          <Error value={errors.gpa} />
          <FormLabel>About</FormLabel>
          <FormInput
            onChangeText={text => {
              this.props.updateUser({ prop: "about", value: text });
            }}
          />
          <Error value={errors.about} />
          <FormLabel>Skills (Seperated By Commas)</FormLabel>
          <FormInput
            value={this.state.skillTitle}
            onChangeText={this.updatedSkills.bind(this)}
          />
          <View style={styles.skillsViewContainer}>{this.renderSkills()}</View>
          <Error value={errors.skills} />
        </KeyboardAwareScrollView>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={this.submitButton.bind(this)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    school: state.user.school,
    major: state.user.major,
    gpa: state.user.gpa,
    about: state.user.about,
    skills: state.user.skills
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateUser: updateUser,
      registerUser: registerUser
    },
    dispatch
  );
};

const styles = {
  containerStyle: {
    height: "auto"
  },
  skillsViewContainer: { margin: 10 },
  skillContainer: {
    marginTop: 5,
    backgroundColor: "white",
    height: "auto",
    width: 100,
    padding: 7,
    shadowOffset: { width: 0.2, height: 0.2 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    alignItems: "center"
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    margin: 5
  },
  button: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "rgb(45, 45, 128)",

    alignItems: "center",
    margin: 5,
    padding: 10,
    backgroundColor: "rgba(45, 45, 128, 0)"
  },
  buttonText: {
    color: "#000"
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpFormStudent);
