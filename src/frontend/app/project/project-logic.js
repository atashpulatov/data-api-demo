function navigateToProject(event) {
    console.log(event);
    event.props.history.push({ pathname: '/' });
    return;
}

export default {
    navigateToProject,
};
