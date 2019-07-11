import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Container, Form, FormGroup, Label, Input
} from 'reactstrap';

class App extends Component {

  constructor(props) {
    super()
    this.state = {
      courses: [],
      modal: false,
      isOpen: false,
      modalCaption: 'Add'
    }
    this.toggle = this.toggle.bind(this);
    this.toggle2 = this.toggle2.bind(this);
    this.addCourse = this.addCourse.bind(this);
    //this.edit = this.edit.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
      modalCaption: 'Add'
    }));
  }
  toggle2() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    this.viewCourses()
  }
  viewCourses() {
    fetch('http://localhost:3030/courses')
      .then(response => response.json())
      .then(json => {
        if (json.responseDescription != "Processed Ok") {
          this.setState({
            viewRes: json.responseDescription
          })
        }
        this.setState({
          courses: json.data
        })
      })
  }
  async addCourse() {
    var check = true
    const { courseTitle, instructor, modalCaption, courseUpdateId } = this.state;
    if (modalCaption === 'Add') {
      var check = await fetch('http://localhost:3030/courses?courseTitle=' + courseTitle + '&instructor=' + instructor, {
        method: 'post'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.responseDescription === 'Processed Ok') {
          return check
        }
        else {
          check = false
          alert(data.responseDescription)
          return check
        }
      });

      if (check) {
        this.toggle()
        this.viewCourses()
        this.setState({
          courseTitle: '',
          instructor: ''
        })
      }
    }
    else if (modalCaption === 'Update') {
      var check = await fetch('http://localhost:3030/courses/' + courseUpdateId + '?courseTitle=' + courseTitle + '&instructor=' + instructor, {
        method: 'put'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.responseDescription === 'Processed Ok') {
          return check
        }
        else {
          check = false
          alert(data.responseDescription)
          return check
        }
      });

      if (check) {
        this.toggle()
        this.viewCourses()
        this.setState({
          courseTitle: '',
          instructor: ''
        })
      }
    }

  }
  edit(id) {
    const { courses } = this.state;
    var index = courses.findIndex(x => x.id == id)
    var course = courses[index]
    this.toggle()
    this.setState({
      courseTitle: course.courseTitle,
      instructor: course.instructor,
      modalCaption: 'Update',
      courseUpdateId: id
    })
  }
  async delete(id) {
    var status = true
    var confirm = window.confirm('Are you sure you want to delete this course?')
    if (confirm) {
      var check = await fetch('http://localhost:3030/courses/' + id, {
        method: 'delete'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data)
        if (data.responseDescription === 'Processed Ok') {

        }
        else {
          status = false
          alert(data.responseDescription)
        }
      });
      if (status) {
        this.viewCourses()
      }
    }
  }
  render() {
    const { courses, modalCaption, viewRes } = this.state;
    console.log(modalCaption)
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Course Management System</NavbarBrand>
          <NavbarToggler onClick={this.toggle2} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Button color="success" onClick={this.toggle}>Add Course</Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{modalCaption} Course</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="courseTitle">Course Title</Label>
                <Input type="text" name="courseTitle" id="courseTitle" placeholder="" value={this.state.courseTitle} onChange={(e) => this.setState({ courseTitle: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label for="instructor">Instructor</Label>
                <Input type="text" name="instructor" id="instructor" placeholder="" value={this.state.instructor} onChange={(e) => this.setState({ instructor: e.target.value })} />
              </FormGroup>
              <Button color="success" onClick={this.addCourse}>Submit</Button>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Container>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Course Title</th>
                <th>Instructor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses && courses.map(element => {
                return <tr>
                  <th scope="row">{element.id}</th>
                  <td>{element.courseTitle}</td>
                  <td>{element.instructor}</td>
                  <td>
                    <Button color="info" onClick={this.edit.bind(this, element.id)}>Edit</Button>
                    <Button color="danger" onClick={this.delete.bind(this, element.id)}>Delete</Button>
                  </td>
                </tr>
              })}
            </tbody>
          </Table>
          {
            !courses && <p style={{ textAlign: 'center' }}>{viewRes}</p>
          }
        </Container>
      </div>
    );
  }
}

export default App;
