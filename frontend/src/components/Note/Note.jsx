import React, { useContext, useEffect, useState } from "react";
import "./Note.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faBackward,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation, useParams } from "react-router";
import { putRequest, deleteRequest } from "../../utils/apiRequest";
import { BASE_URL, UPDATE_NOTE, DELETE_NOTE } from "../../utils/apiEndpoints";
import { NotesContext } from "../../context/contex";
import { listFormatDate, noteFormatDate } from "../../utils/helpers";

const Note = () => {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const notesContext = useContext(NotesContext);
  const [updatedAt, setUpdatedAt] = useState("");
  const [isArchive, setIsArchive] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // note comes from the usehistory() from Sidenav componeent
    if (location.note) {
      setTitle(location.note.title);
      setDesc(location.note.desc);
      setUpdatedAt(location.note.updatedAt);
      setIsArchive(location.note.archive);
    }
  }, [location.note]);

  useEffect(() => {
    if (notesContext.notesState.length > 0) {
      const [selectednote] = notesContext.notesState.filter(
        (e) => e._id === params.id
      );
      console.log(selectednote);
      if (selectednote) {
        setTitle(selectednote.title);
        setDesc(selectednote.desc);
        setUpdatedAt(selectednote.updatedAt);
        setIsArchive(selectednote.archive);
      }
    }
  }, [notesContext.notesState]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  // handle our changes
  const handleUpdateNote = async (key) => {
    let query = {};

    if (key == "title") {
      query["title"] = title;
    } else if (key == "desc") {
      query["desc"] = desc;
    }

    const response = await putRequest(
      `${BASE_URL}${UPDATE_NOTE}${params.id}`,
      query
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    notesContext.notesDispatch({
      type: "updateNoteSuccess",
      payload: response,
      id: params.id,
    });
  };

  // Handle our archive notes
  const handleArchiveNote = async () => {
    // archive 1 means we're moving to the trash, keep in mind is not delete yet
    let query = {
      archive: 1,
    };
    const response = await putRequest(
      `${BASE_URL}${UPDATE_NOTE}${params.id}`,
      query
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    notesContext.notesDispatch({ type: "archiveNoteSuccess", id: params.id });
    resetState();
    history.push(`/all-notes`);
  };

  const handleUnArchiveNote = async () => {
    let query = {
      archive: 0,
    };

    const response = await putRequest(
      `${BASE_URL}${UPDATE_NOTE}${params.id}`,
      query
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    notesContext.notesDispatch({ type: "archiveNoteSuccess", id: params.id });
    resetState();
    history.push(`/trash`);
  };

  const handleDeleteNote = async () => {
    const response = await deleteRequest(
      `${BASE_URL}${DELETE_NOTE}${params.id}`
    );
    if (response.error) {
      setError(response.error);
      return false;
    }
    notesContext.notesDispatch({ type: "deleteNoteSuccess", id: response });
    resetState();
    history.push("/trash");
  };

  const resetState = () => {
    setTitle("");
    setDesc("");
    setUpdatedAt("");
    setIsArchive(0);
    setError(null);
  };

  return (
    <div className="note">
      <div className="note__header">
        <div className="note__header-date">
          Last edited on {noteFormatDate(updatedAt)}
        </div>
        <div className="note__header-action-btn">
          {!isArchive ? (
            <div className="action-btn" onClick={handleArchiveNote}>
              <FontAwesomeIcon icon={faArchive} />
            </div>
          ) : (
            <>
              <div className="action-btn">
                <FontAwesomeIcon
                  icon={faBackward}
                  onClick={handleUnArchiveNote}
                />
              </div>
              <div className="action-btn" onClick={handleDeleteNote}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="note__body">
        <div className="note__body-head">
          <input
            value={title}
            placeholder="Title"
            onChange={handleTitleChange}
            onBlur={() => handleUpdateNote("title")}
          />
        </div>
        <div className="note__body-content">
          <textarea
            value={desc}
            placeholder="Start writing"
            onChange={handleDescChange}
            onBlur={() => handleUpdateNote("desc")}
          />
        </div>
      </div>
    </div>
  );
};

export default Note;
