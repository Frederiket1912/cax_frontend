import React, { useState, useEffect } from "react";
import {
  CreateSupportTicket,
  ReplySupportTicket,
  CloseSupportTicket,
  GetUserSupportTicket,
} from "./settings";

function User_support_ticket({ apiFetchFacade }) {
  const [supportTicket, setSupportTicket] = useState();
  const [comment, setComment] = useState();
  const [supportSubject, setSupportSubject] = useState();
  const [response, setResponse] = useState("");
  const [ticketCloset, setTicketCloset] = useState("");
  const [ticketCreated, setTicketCreated] = useState();

  useEffect(() => {
    const url = GetUserSupportTicket;
    apiFetchFacade()
      .getApiFetch(url + localStorage.getItem("username"))
      .then((data) => {
        setSupportTicket({ ...data });
      })
      .catch((err) => {
        setSupportTicket(err.status);
      });
    console.log(supportTicket);
  }, [apiFetchFacade]);

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleChange1 = (event) => {
    setSupportSubject(event.target.value);
  };

  function ViewSupportTicket() {
    if (supportTicket === undefined) {
      return <></>;
    }
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{supportTicket.ticket_id}</td>
              <td>{supportTicket.ticketchain[0].subject}</td>
            </tr>
          </tbody>
        </table>
        <br></br>
        <br></br>
        {supportTicket.ticketchain.map((ticketReply, index) => (
          <MapSupportReply ticketReply={ticketReply} key={index} />
        ))}
      </div>
    );
  }

  function MapSupportReply({ ticketReply }) {
    //debugger;
    if (supportTicket === null || supportTicket === undefined) return <></>;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Comment</th>
              <th>Reply by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ticketReply.comment}</td>
              {ticketReply.username === localStorage.getItem("username") && (
                <td>You</td>
              )}
              {ticketReply.username !== localStorage.getItem("username") && (
                <td>{ticketReply.username}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  function ReplyToTicket(event) {
    event.preventDefault();
    const responseReply = {
      supportid: supportTicket.ticket_id,
      supporttickets: [
        {
          subject: supportTicket.ticketchain[0].subject,
          comment: comment,
          username: localStorage.getItem("username"),
        },
      ],
    };
    const url = ReplySupportTicket;
    apiFetchFacade()
      .getApiFetch2(responseReply, url)
      .then((data) => {
        setResponse(200);
      })
      .catch((err) => {
        setResponse(400);
      });
  }

  function CreateTicket(event) {
    event.preventDefault();
    const responseReply = {
      username: localStorage.getItem("username"),
      supporttickets: [
        {
          ticketchain: [
            {
              subject: supportSubject,
              comment: comment,
              username: localStorage.getItem("username"),
            },
          ],
        },
      ],
    };
    const url = CreateSupportTicket;
    apiFetchFacade()
      .getApiFetch2(responseReply, url)
      .then((data) => {
        setTicketCreated(200);
      })
      .catch((err) => {
        setTicketCreated(400);
      });
  }

  function CloseTicket(event) {
    event.preventDefault();
    const url = CloseSupportTicket;
    apiFetchFacade()
      .putApiCall2(url + supportTicket.ticket_id)
      .then((data) => {
        setTicketCloset(200);
      })
      .catch((err) => {
        setTicketCloset(400);
      });
  }
  return (
    <div>
      {supportTicket === undefined && <></>}
      {supportTicket !== undefined && supportTicket.ticket_id === 0 && (
        <div>
          <h3>Create support ticket</h3>
          <p>Subject :</p>
          <textarea
            onChange={handleChange1}
            type="text"
            name="Subject"
            placeholder="Subject"
          ></textarea>
          <p>Comment :</p>
          <textarea
            className="inputfield"
            onChange={handleChange}
            type="text"
            name="comment"
            placeholder="Comment"
            rows="10"
            cols="70"
          ></textarea>
          <div>
            <button onClick={(event) => CreateTicket(event)}>
              Submit Ticket
            </button>
          </div>
          {ticketCreated === 200 && <p>Your support ticket has been sent</p>}
          {ticketCreated === 400 && (
            <p>Something went wrong, please try again later</p>
          )}
        </div>
      )}
      {supportTicket !== undefined && supportTicket.ticket_id !== 0 && (
        <div>
          <ViewSupportTicket />
          <br></br>
          <p>Reply :</p>
          <textarea
            className="inputfield"
            onChange={handleChange}
            type="text"
            name="comment"
            placeholder="Comment"
            rows="10"
            cols="70"
          ></textarea>
          <br></br>
          <div>
            <button onClick={(event) => ReplyToTicket(event)}>Reply</button>
            <button onClick={(event) => CloseTicket(event)}>
              Close support ticket
            </button>
          </div>
        </div>
      )}

      {response === "" && <></>}
      {response === 200 && <p>Your reply has been sent</p>}
      {response === 400 && <p>Something went wrong, please try again later</p>}
      {ticketCloset === "" && <></>}
      {ticketCloset === 200 && <p>Your ticket has successfully been closed</p>}
      {ticketCloset === 400 && (
        <p>Something went wrong, please try again later</p>
      )}
    </div>
  );
}

export default User_support_ticket;
