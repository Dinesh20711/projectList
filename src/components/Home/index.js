import {Component} from 'react'
import './index.css'
import ProjectItem from '../ProjectItem'
import Loader from 'react-loader-spinner'

const apiStatus = {
  initial: 'INITIAL',
  inProcess: 'INPROCESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Home extends Component {
  state = {
    projectList: [],
    activeOption: this.props.categoriesList[0]?.id || '',
    apiResponse: apiStatus.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeOption !== this.state.activeOption) {
      this.getProjects()
    }
  }

  onClickRetry = () => {
    this.getProjects()
  }

  onChangeOptions = event => {
    this.setState({activeOption: event.target.value})
  }

  getProjects = async () => {
    const {activeOption} = this.state
    this.setState({apiResponse: apiStatus.inProcess})
    let apiUrl
    if (activeOption === 'ALL') {
      apiUrl = `https://apis.ccbp.in/ps/projects?category=ALL`
    } else {
      apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    }

    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.setState({
        projectList: data.projects,
        apiResponse: apiStatus.success,
      })
    } else {
      this.setState({apiResponse: apiStatus.failure})
    }
  }

  renderLoader = () => {
    return (
      <div className="loader" data-testid="loader">
        <Loader type="TailSpin" width={50} height={50} color="blue" />
      </div>
    )
  }

  renderSuccessView = () => {
    const {categoriesList} = this.props
    const {activeOption, projectList} = this.state
    return (
      <div>
        <ul className="list-items">
          {projectList.map(project => (
            <ProjectItem key={project.id} projectDetails={project} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => {
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button onClick={this.onClickRetry}>Retry</button>
      </div>
    )
  }

  allViewRender = () => {
    const {apiResponse} = this.state
    switch (apiResponse) {
      case apiStatus.inProcess:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {categoriesList} = this.props
    const {activeOption, projectList} = this.state

    return (
      <div className="bg-container">
        <nav className="nav-bar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>

        <div>
          <select
            value={activeOption}
            onChange={this.onChangeOptions}
            className="select-section"
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.allViewRender()}
      </div>
    )
  }
}

export default Home
