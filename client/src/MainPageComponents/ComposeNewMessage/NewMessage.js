import React, { useState, useEffect } from 'react';
import SearchRecipient from '../SearchRecipient/SearchRecipient';
import './NewMessage.css';
import axios from 'axios';

import { deploymentMode, backendPort, backendHost, backendBaseURL } from '../../App';

const NewMessage = ({onClose, onMinimize, updatePopupSubject, subject}) => {
    
    const [userData, setUserData] = useState(null);

    {/*All email types */}
    const [emailType, setEmailType] = useState('');
    const [recipients, setRecipients] = useState([]);
    const [body, setBody] = useState('')
    const [deadline, setDeadline] = useState(null)

    {/*news and claims task type */}
    const[taskType, setTaskType] = useState('')

    {/*claims type*/}
    const[priority, setPriority] = useState('')
    const[insuredName, setInsuredName] = useState('')
    const[claimantName, setClaimantName] = useState('')
    const[lineOfBusiness, setLineOfBusiness] = useState('')

    {/*policy type*/}
    const[changesToPremium, setChangesToPremium] = useState('')

  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(backendBaseURL + '/users/me', {
            withCredentials: true,
          });
          setUserData(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
        //   setIsLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

    const handleNewMessage = async (e) => {
        e.preventDefault();
        
        let newsDetails = null;
        let claimDetails = null;
        let policyDetails = null;

        if (emailType === 'news') {
        // messageData.newsDetails = {
        //     expirationdate: deadline,
        //     type: taskType,
        // };
            newsDetails = {
                expirationdate: deadline,
                type: taskType,
            };
        } else if (emailType === 'claim') {
            // messageData.claimDetails = {
            //     priority: priority,
            //     duedate: deadline,
            //     insuredname: insuredName,
            //     claimantname: claimantName,
            //     tasktype: taskType,
            //     lineofbusiness: lineOfBusiness,
            //     iscompleted: FALSE,
            // };
            claimDetails = {
                priority: priority,
                duedate: deadline,
                insuredname: insuredName,
                claimantname: claimantName,
                tasktype: taskType,
                lineofbusiness: lineOfBusiness,
                iscompleted: false,
            };
        } else if (emailType === 'policy') {
            // messageData.policyDetails = {
            //     changestopremium: changesToPremium,
            //     billingreminderdate: deadline,
            // };
            policyDetails = {
                changestopremium: changesToPremium,
                billingreminderdate: deadline,
            };
        };

        try {
            const response = await axios.post(backendBaseURL + '/notifications/create', {
                userid: userData.id,
                type: emailType,
                title: subject,
                body: body,
                recipients: recipients,
                newsDetails: newsDetails,
                claimDetails: claimDetails,
                policyDetails: policyDetails,
            }, {withCredentials: true});

            console.log("message sent");

            if (response.status === 201) {
                // setConsoleMessage(response.data.consoleMessage);
                window.location.href="/main";
              }

        } catch (error) {
            console.error("NewMessage error:", error);
            // setConsoleMessage(error.response?.data?.consoleMessage || "New Notification failed.");
        }
    };

    // console.log('New Notification created :)', newUser.toJSON());

    return (
        <div className='new-mail-wrapper'>
        <form onSubmit={handleNewMessage} className="email-form">
            <div className='scrollable-container'>
                <div className="new-mail-title">
                    <div className="new-mail-container">
                        <p>{subject.length !== 0 ?`New Message - ` + subject:`New Message`}</p>
                    </div>
                    <div className='close-button-container'>
                        <button
                            type="button"
                            className="minimize-button"
                            onClick={() => onMinimize && onMinimize()}
                        >
                            _
                        </button>
                        <button className="close-button" onClick={onClose}>X</button>
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Subject"
                    className="subject"
                    value={subject}
                    onChange={(e) => updatePopupSubject(e.target.value)}
                    required
                />

                {/*Choose Email Type*/}
                <div className="email-type-container">
                    <div className="email-type-text-container">
                        <p className="email-type-text">Type: </p>
                    </div>
                    {['news', 'policy', 'claim'].map((type) => (
                        <div className="email-option" key={type}>
                            <input
                                type="radio"
                                name="emailType"
                                className="emailType"
                                id={type}
                                value={type}
                                checked={emailType === type}
                                onChange={(e) => setEmailType(e.target.value)}
                                required
                            />
                            <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                        </div>
                    ))}
                </div>
                {/*deadline for all types*/}
                <div className="email-deadline-container">
                    <p className="deadline-placeholder">Deadline:</p>
                    <input
                        type="datetime-local"
                        placeholder="Deadline"
                        className="email-deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>
                
                <div className="search-recipient-container-box">
                    <SearchRecipient onSearch={setRecipients} className='search-import'/>
                </div>

                {/*Task type for news and claim types*/}

                {(emailType == "claim" || emailType == "news") && (
                    <div className="news-claims-task-type-container">
                        <input
                            type="text"
                            placeholder="Type of Task"
                            className="news-claims-task-type"
                            value={taskType}
                            onChange={(e) => setTaskType(e.target.value)}
                            required
                        />
                    </div>
                )}

                {/*claims info*/}
                {emailType == "claim" && (
                <div className="claim-details-container">
                    {/*priority*/}
                    <div className="email-type-container">
                        <div className="email-type-text-container">
                            <p className="email-type-text">Priority:</p>
                        </div>
                        {['HIGH_PRIORITY', 'MEDIUM_PRIORITY', 'LOW_PRIORITY'].map((type) => {
                            const labelMap = {
                                HIGH_PRIORITY: 'High',
                                MEDIUM_PRIORITY: 'Medium',
                                LOW_PRIORITY: 'Low',
                            };
                            return (
                                <div className="claim-priority-option" key={type}>
                                    <input
                                        type="radio"
                                        className="emailType"
                                        id={type}
                                        value={type}
                                        checked={priority === type}
                                        onChange={(e) => setPriority(e.target.value)}
                                        required
                                    />
                                    <label htmlFor={type}>{labelMap[type]}</label>
                                </div>
                            );
                        })}
                    
                    </div>

                    <div className="select-insured-name">
                        <input
                        type="text"
                        placeholder="Name of Insured"
                        className="insured-name-input"
                        value={insuredName}
                        onChange={(e) => setInsuredName(e.target.value)}
                        required
                        />
                    </div>

                    <div className="select-claimant-name">
                        <input
                            type="text"
                            placeholder="Name of Claimant"
                            className="claimant-name-input"
                            value={claimantName}
                            onChange={(e) => setClaimantName(e.target.value)}
                            required
                            />
                    </div>

                    <div className="select-line-of-business">
                        <input
                            type="text"
                            placeholder="Line of Business"
                            className="line-of-business-input"
                            value={lineOfBusiness}
                            onChange={(e) => setLineOfBusiness(e.target.value)}
                            required
                            />
                    </div>
                </div>
                )}

                {/*policy info*/}

                {emailType == "policy" && (
                    <div className="policy-details-container">

                        <div className="select-changes-to-premium">
                            <input
                                type="text"
                                placeholder="Changes To Premium"
                                className="changes-to-premium-input"
                                value={changesToPremium}
                                onChange={(e) => setChangesToPremium(e.target.value)}
                                required
                                />
                        </div>

                    </div>
                )}

                <div className='message-content-container'>
                    <textarea
                        id="message"
                        className="message-content-textbox"
                        value={body}
                        onChange={(e) => {
                            setBody(e.target.value);
                            e.target.style.height = 'auto'
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        required
                    ></textarea>
                </div>
            </div>
            <div className='send-button-container'>
                <button type="submit" className="send-button">Send</button>
            </div>

        </form>
        </div>
      );
};

export default NewMessage;