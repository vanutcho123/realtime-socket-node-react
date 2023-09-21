import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, mesages, isMessagesLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);

  const [textMessages, setTextMessages] = useState("");

  // Xu li notification
  const scroll = useRef();
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mesages]);

  if (!recipientUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selection yet...
      </p>
    );

  if (isMessagesLoading)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {mesages &&
          mesages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user?._id
                  ? "message align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
              ref={scroll}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>

      <Stack direction="horizontal" gap={3} className="flex-grow-0 chat-input">
        <InputEmoji
          value={textMessages}
          onChange={setTextMessages}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(
              textMessages,
              user,
              currentChat._id,
              setTextMessages
            )
          }
        >
          Send
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
