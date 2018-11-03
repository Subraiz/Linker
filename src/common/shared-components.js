import React, { Component } from "react";
import { View as RView, Text as RText } from "react-native";
import {
  ButtonGroup as RNEButtonGroup,
  FormLabel as RFormLabel,
  FormInput as RFormInput,
  FormValidationMessage as RFormValidationMessage
} from "react-native-elements";

export const View = props => <RView {...props}>{props.children}</RView>;

export const ButtonGroup = props => (
  <RNEButtonGroup {...props}>{props.children}</RNEButtonGroup>
);

export const FormLabel = props => {
  <RFormLabel {...props}>{props.children}</RFormLabel>;
};

export const FormInput = props => {
  <RFormInput {...props}>{props.children}</RFormInput>;
};

export const FormValidationMessage = props => {
  <RFormValidationMessage {...props}>{props.children}</RFormValidationMessage>;
};

export const Text = props => <RText {...props}>{props.children}</RText>;
