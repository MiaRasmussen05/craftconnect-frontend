import React, { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import taskStyles from "../../styles/TaskPage.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";

import { useCurrentUser } from "../../contexts/CurrentUserContext";
import IdeasCreateForm from "../tasks/IdeasCreateForm";
import TaskCreateForm from "../tasks/TaskCreateForm";
import Idea from "../tasks/Idea";
import Task from "../tasks/Task";

function TaskPage() {
  const { id } = useParams();

  const currentUser = useCurrentUser();
  const [ideas, setIdeas] = useState({ results: [] });
  const [tasks, setTasks] = useState({ results: [] });
  const [title, setTitle] = useState("");


  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const [{ data: ideas }] = await Promise.all([
          axiosReq.get(`/ideas/?id=${id}`),
        ]);
        setIdeas(ideas);
      } catch (err) {
        // console.log(err);
      }
    };

    fetchIdeas();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosReq.get(`/tasks/`);
        const tasksData = response.data;
        setTasks(tasksData);
      } catch (err) {
        // console.log(err);
      }
    };
  
    fetchTasks();
  }, [id, title]);

  return (
    <Container>
      <Row >
        <Col className="py-2 p-0 p-lg-2" lg={7}>
          <h1 className={`${taskStyles.Header} text-center mt-5`}>Don't forget your next project!</h1>
          <IdeasCreateForm setIdeas={setIdeas}  />
          <div className={`${appStyles.Content} ${taskStyles.IdeasWrapper}`}>
            {currentUser ? (
              <br />
            ) : ideas.results.length ? (
              "Ideas"
            ) : null}
            {ideas.results.length ? (
              <InfiniteScroll
                children={ideas.results.map((idea) => (
                  <Col key={idea.id}>
                    <Idea key={idea.id} id={idea.id} {...idea} setIdeas={setIdeas} />
                  </Col>
                ))}
                dataLength={ideas.results.length}
                loader={<Asset spinner />}
                hasMore={!!ideas.next}
                next={() => fetchMoreData(ideas, setIdeas)}
              />
            ) : currentUser ? (
              <span>No ideas... yet</span>
            ) : (
              <Container>
                <Asset spinner />
              </Container>
            )}
          </div>
        </Col>
        <Col className="py-3 p-lg-3" lg={5}>
          <h2 className={`${taskStyles.Header} text-center mt-5`}>Todo Task</h2>
          <div className={`${appStyles.Content} p-4`}>
            <TaskCreateForm setTasks={setTasks} setTitle={setTitle} tasks={tasks} ideas={ideas.results} />
          </div>
        </Col>
      </Row>
      <h2 className={`text-center mt-5`}>Todo task list</h2>
        {currentUser ? (
          <br />
        ) : tasks.results.length ? (
          "Tasks"
        ) : null}
        {tasks.results.length ? (
          <InfiniteScroll
            children={tasks.results.map((task) => (
              <Col key={task.id} lg={4} className={`${taskStyles.TodoCard}`}>
                <Task {...task} setTasks={setTasks} />
              </Col>
            ))}
            dataLength={tasks.results.length}
            loader={<Asset spinner />}
            hasMore={!!tasks.next}
            next={() => fetchMoreData(tasks, setTasks)}
          />
        ) : currentUser ? (
          <span>No tasks... yet</span>
        ) : (
          <Container>
            <Asset spinner />
          </Container>
        )}
    </Container>
  );
}
export default TaskPage;