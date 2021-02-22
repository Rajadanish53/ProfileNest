import React from "react";

function Settings({ setchange, change }) {
  return (
    <div className="settingwrapper">
      <h1 onClick={() => setchange({ ...change, name: true })}>Change Name</h1>
      <h1 onClick={() => setchange({ ...change, password: true })}>
        Change Password
      </h1>
      <h1 onClick={() => setchange({ ...change, email: true })}>
        Change Email
      </h1>
    </div>
  );
}

export default Settings;
