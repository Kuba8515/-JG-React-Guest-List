/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import Icon from './images/994450.png';

const icon = css`
  display: flex;
  width: 70px;
  margin-right: 5px;
`;

const heading = css`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-weight: bold;
`;

const formStyle = css`
  display: flex;
  justify-content: center;
  padding: 10px 10px 10px 10px;
  border: none;
  border-radius: 5px;
  background-color: #3d9970;
  margin: 20px 20% 0 20%;

  input {
    margin-right: 20px;
    line-height: 30px;
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }
  label {
    margin-right: 5px;
    line-height: 40px;
    font-weight: 600;
  }
  button {
    text-transform: uppercase;
    width: 200px;
    border: none;
    border-radius: 5px;
    background-color: green;
    color: white;
    font-weight: 600;
    cursor: pointer;
  }
`;

const attendingGuestList = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  font-size: 20px;
  list-style-type: none;
  background: #b4d0c3;
  padding-right: 10px;
  justify-content: space-around;
  list-style-type: circle;
  margin: 20px 20% 0 20%;
  border-radius: 5px;

  li {
    margin: 10px 10px 10px 10px;
  }
  button {
    border: none;
    border-radius: 5px;
    background-color: red;
    color: white;
    font-weight: 200;
    cursor: pointer;
  }
`;

function App() {
  const baseUrl = 'http://localhost:5000';
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  // Load guest list from API.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/`);
        const allGuests = await response.json();
        setGuestList(allGuests);
        console.log(allGuests);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Add a new guest to the list.
  async function addGuest(event) {
    event.preventDefault();
    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const newGuest = await response.json();
    console.log(newGuest);
    // Copy array and add new data
    const newGuestInfo = [...guestList];
    newGuestInfo.push(newGuest);
    setGuestList(newGuestInfo);
    setFirstName('');
    setLastName('');
  }

  // Update a guest from the list.
  async function patchGuest(guest) {
    const response = await fetch(`${baseUrl}/${guest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: guest.attending }),
    });
    const updatedGuest = await response.json();
    console.log(updatedGuest);
  }

  // Remove guest from the guest list.
  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    console.log(deletedGuest);
    const guestToDelete = guestList.filter((guest) => guest.id !== id);
    setGuestList(guestToDelete);
    console.log(deletedGuest);
  }

  function handleAttending(id, attendance) {
    const newGuestsLists = [...guestList];
    const attendingGuest = newGuestsLists.find((guest) => guest.id === id);
    attendingGuest.attending = attendance;
    patchGuest(attendingGuest);
    setGuestList(newGuestsLists);
  }

  return (
    <div>
      <div css={heading}>
        <img src={Icon} alt="Guest-list-icon" css={icon} />
        <h1>React Guest List</h1>
      </div>
      <span>{loading ? 'Guest List is loading...' : ''}</span>
      <form css={formStyle}>
        <label htmlFor="firstName">First name: </label>
        <input
          id="firstName"
          value={firstName}
          disabled={loading}
          onChange={(e) => setFirstName(e.currentTarget.value)}
        />
        <label htmlFor="lastName">Last name: </label>
        <input
          id="lastName"
          value={lastName}
          disabled={loading}
          onChange={(e) => setLastName(e.currentTarget.value)}
        />

        <button
          onClick={(e) => {
            setFirstName(firstName);
            setLastName(lastName);
            addGuest(e);
          }}
        >
          Add Guest
        </button>
      </form>
      <ul css={attendingGuestList}>
        {guestList.map((guest) => {
          return (
            <li key={guest.id}>
              {guest.firstName} {guest.lastName}{' '}
              <input
                type="checkbox"
                id="attending"
                checked={guest.attending}
                onChange={(e) => {
                  handleAttending(guest.id, e.currentTarget.checked);
                }}
              />
              <label
                css={{ fontSize: 10, marginRight: 10 }}
                htmlFor="attending"
              >
                Attending
              </label>
              <button onClick={() => removeGuest(guest.id)}>Remove</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
