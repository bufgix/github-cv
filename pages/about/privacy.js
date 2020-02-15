import React from "react";
import { Analytics } from "../../components";

class PrivacyPage extends React.Component {
  constructor(props) {
    super(props);
    Analytics.logPageView("/about/privacy");
  }

  render() {
    return (
      <div className="uk-container uk-padding">
        <div className="uk-card uk-card-default">
          <div className="uk-card-header">
            <h1>Github CV Privacy Policy</h1>
          </div>
          <div className="uk-card-body">
            <h3>WHAT WE COLLECT</h3>
            <hr />
            <p>
              We get information about you in a range of ways. Information You
              Give Us. Information we collect from you includes: IP address;
              Information Automatically Collected. We may automatically record
              certain information about how you use our Site (we refer to this
              information as “Log Data“). Log Data may include information such
              as a user’s Internet Protocol (IP) address, device and browser
              type, and operating system. We use this information to administer
              and provide access to the Services Information we will never
              collect.
            </p>

            <h3>USE OF PERSONAL INFORMATION</h3>
            <hr />
            <p>
              To provide our service we will use your personal information in
              the following ways: To enable you to access and use the Services
              To comply with law We use your personal information as we believe
              necessary or appropriate to comply with applicable laws, lawful
              requests and legal process, such as to respond to subpoenas or
              requests from government authorities. For compliance, fraud
              prevention, and safety We may use your personal information to
              protect, investigate, and deter against fraudulent, unauthorized,
              or illegal activity
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PrivacyPage;
