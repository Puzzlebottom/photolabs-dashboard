import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";

import { getTotalPhotos, getTotalTopics, getUserWithMostUploads, getUserWithLeastUploads } from "helpers/selectors";
import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];

export default class Dashboard extends Component {

  state = { photos: [], topics: [], loading: true, focused: null };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem('focused'));

    if (focused) this.setState({ focused });

    const urlsPromise = ['/api/photos', '/api/topics']
      .map(url => fetch(url).then(res => res.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos,
          topics
        });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem('focused', JSON.stringify(this.state.focused));
    }
  }

  toggleFocus(id) { this.setState(prev => ({ focused: prev.focused ? null : id })); };

  render() {
    const dashboardClasses = classnames("dashboard", { "dashboard--focused": this.state.focused });

    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
      .map(datum => {
        const { id, label, getValue } = datum;
        return <Panel key={id} label={label} value={getValue(this.state)} toggleFocus={e => this.toggleFocus(id)} />;
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