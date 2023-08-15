import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];

export default class Dashboard extends Component {

  state = { loading: false, focused: null };

  toggleFocus(id) { this.setState(prev => ({ focused: prev.focused ? null : id })); };

  render() {
    const dashboardClasses = classnames("dashboard", { "dashboard--focused": this.state.focused });

    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map(datum => {
        const { id, label, value } = datum;
        return <Panel key={id} label={label} value={value} toggleFocus={e => this.toggleFocus(id)} />;
      });

    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <main className={dashboardClasses}>
        {panels}
      </main>
    );
  };
};