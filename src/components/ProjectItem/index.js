import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {id, image_url, name} = projectDetails
  return (
    <li className="project-card">
      <img src={image_url} alt={name} className="img-section" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectItem
