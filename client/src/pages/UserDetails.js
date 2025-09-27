import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addTask, deleteTask, updateTask } from "../store/Task";
import { Api } from "./Api";

function UserDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [userTask, setUserTask] = useState([]);
  const [modalTitle, setModalTitle] = useState("Add Task");
  const [selectedTask, setSelectedTask] = useState(null);

  const openModal = (title, task = null) => {
    setModalTitle(title);
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    formik.resetForm();
  };

  const getUserTask = async () => {
    try {
      const resp = await Api({ method: "GET", url: "/get-taskData" });
      if (resp.status) {
        setUserTask(resp.data);
      } else {
        setUserTask([]);
      }
    } catch (err) {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    getUserTask();
  }, []);

  const columns = [
    { 
      name: "Si.No", 
      selector: (_, i) => i + 1, 
      width: "80px", 
      center: true 
    },
    { 
      name: "Task", 
      selector: (row) => row.title, 
      sortable: true 
    },
    { 
      name: "Status", 
      selector: (row) => row.status, 
      sortable: true 
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => openModal("Update Task", row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",
      center: true,
    },
  ];

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteTask(id)).unwrap();
      toast.success(res.message);
      getUserTask();
    } catch {
      toast.error("Delete failed");
    }
  };

  const formik = useFormik({
    initialValues: { title: "", status: "" },
    validationSchema: Yup.object({
      title: Yup.string().required("Enter task"),
      status: Yup.string().required("Select status"),
    }),
    onSubmit: async (values) => {
      try {
        const action = selectedTask
          ? updateTask({ id: selectedTask._id, data: values })
          : addTask(values);
        const res = await dispatch(action).unwrap();
        toast.success(res.message);
        closeModal();
        getUserTask();
      } catch {
        toast.error("Save failed");
      }
    },
  });

  useEffect(() => {
    if (selectedTask)
      formik.setValues({
        title: selectedTask.title,
        status: selectedTask.status,
      });
  }, [selectedTask]);

  return (
    <div className="container my-5">
      <ToastContainer />
      <div className="card shadow-lg">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "mediumseagreen", color: "white" }}
        >
          <h5>Task List</h5>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light btn-sm"
              onClick={() => openModal("Add Task")}
            >
              Add Task
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={userTask}
            highlightOnHover
            dense
            pagination
          />
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div
                className="modal-header"
                style={{ backgroundColor: "#e8f5e9" }}
              >
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-3">
                    <label>Title</label>
                    <input
                      className={`form-control ${
                        formik.touched.title && formik.errors.title
                          ? "is-invalid"
                          : ""
                      }`}
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <div className="invalid-feedback">
                      {formik.errors.title}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>Status</label>
                    <select
                      className={`form-control ${
                        formik.touched.status && formik.errors.status
                          ? "is-invalid"
                          : ""
                      }`}
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="invalid-feedback">
                      {formik.errors.status}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDetail;
