import React, { useEffect, useState, useContext } from "react";
import "./NotesList.scss";
import { useRouteMatch, useHistory, NavLink } from "react-router-dom";
import {
  BASE_URL,
  GET_ALL_NOTES,
  GET_TRASH_NOTES,
} from "../../utils/apiEndpoints";
import { getRequest } from "../../utils/apiRequest";
import { NotesContext } from "../../context/contex";
import { listFormatDate } from "../../utils/helpers";

const NoteList = (props) => {
  const [error, setError] = useState(null);
  const notesContext = useContext(NotesContext);
  const { title } = props;
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    getNotes();
    console.log(match);
  }, [match.url]);

  const getNotes = async () => {
    let endpoint = "";

    if (match.url == "/all-notes") {
      endpoint = GET_ALL_NOTES;
    } else if (match.url == "/trash") {
      endpoint = GET_TRASH_NOTES;
    } else {
      return;
    }

    const response = await getRequest(`${BASE_URL}${endpoint}`);
    if (response.error) {
      setError(response.error);
      return false;
    }

    notesContext.notesDispatch({
      type: "getAllNotesSuccess",
      payload: response,
    });
    if (response.length > 0) {
      history.push({
        pathname: `${match.url}/${response[0]._id}`,
        note: response[0],
      });
    }
  };

  return (
    <div className="note-list">
      <div className="note-list__header">
        <div className="note-list__header-title">
          <h1>{title}</h1>
        </div>
        <div className="note-list__header-sub-head">
          <div className="note-count">{notesContext.notesState.length}</div>
        </div>
      </div>

      {/* body */}
      <div className="note-list__body">
        {notesContext.notesState.length > 0 ? (
          notesContext.notesState.map((note) => (
            <NavLink
              key={note._id}
              className="note-card"
              to={{
                pathname: `${match.url}/${note._id}`,
                note,
              }}
            >
              <div className="note-card__head">
                <div className="note-card__title">{note.title}</div>
                <div className="note-card__desc">{note.desc}</div>
              </div>
              <div className="note-card__date">
                {listFormatDate(note.updatedAt)}
              </div>
            </NavLink>
          ))
        ) : (
          <div className="empty-state">No data found</div>
        )}
      </div>
    </div>
  );
};

export default NoteList;
