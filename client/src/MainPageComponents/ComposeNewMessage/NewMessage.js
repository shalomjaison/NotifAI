import React, { useState } from 'react';
import SearchRecipient from '../SearchRecipient/SearchRecipient';
import './NewMessage.css';
import axios from 'axios';

const NewMessage = () => {
    
    {/*All email types */}
    const [subject, setSubject] = useState('');
    const [emailType, setEmailType] = useState('');
    const [recipient, setRecipient] = useState([]);
    const [body, setBody] = useState('')
    const[deadline, setDeadline] = useState(null)

    {/*news and claims task type */}
    const[taskType, setTaskType] = useState('')

    {/*claims type*/}
    const[priority, setPriority] = useState('')
    const[insuredName, setInsuredName] = useState('')
    const[claimantName, setClaimantName] = useState('')
    const[lineOfBusiness, setLineOfBusiness] = useState('')

    {/*policy type*/}
    const[changesToPremium, setChangesToPremium] = useState('')

    {/*Other useStates */}
    const [message, setMessage] = useState('');

    const handleNewMessage = async (e) => {
        e.preventDefault();
        
        if (emailType === 'news') {
        messageData.newsDetails = {
            expirationdate: deadline,
            type: taskType,
        };
        } else if (emailType === 'claim') {
        messageData.claimDetails = {
            priority: priority,
            duedate: deadline,
            insuredname: insuredName,
            claimantname: claimantName,
            tasktype: taskType,
            lineofbusiness: lineOfBusiness,
            iscompleted: FALSE,
        };
        } else if (emailType === 'policy') {
        messageData.policyDetails = {
            changestopremium: changesToPremium,
            billingreminderdate: deadline,
        };
        };

        useEffect(() => {
            const fetchUserId = async () => {
                try {
                const response = await axios.get('http://localhost:3000/users/me', {
                    withCredentials: true,
                });
                setUserId(response.data.user.id);
                } catch (error) {
                console.error('Error fetching user data:', error);
                } finally {
                setIsLoading(false);
                }
            };
        
            fetchUserId();
        }, []);

        try {
            const response = await axios.post('http://localhost:9500/create', {
                userid,
                type,
                title,
                body,
                recipients,
                newsDetails,
                claimDetails,
                policyDetails,
            });

            if (response.status === 201) {
                setConsoleMessage(response.data.consoleMessage);
                window.location.href="/";
              }

        } catch (error) {
            console.error("NewMessage error:", error.response?.data || error.consoleMessage);
            setConsoleMessage(error.response?.data?.consoleMessage || "New Notification failed.");
        }
    };

    console.log('New Notification created :)', newUser.toJSON());

    return (
        <div className='new-mail-wrapper'>
        <form onSubmit={handleNewMessage}>
            <div className="new-mail-title">
                <div className="new-mail-container">
                    <p>New Message</p>
                </div>
            </div>
            <input
                type="text"
                placeholder="Subject"
                className="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                <input
                    type="text"
                    placeholder="Deadline"
                    className="email-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            {/*Task type for news and claim types*/}
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

            {/*claims info*/}
            <div className="claim-details-container">
                <div className="select-claim-priority">
                    <input
                    type="text"
                    placeholder="Priority"
                    className="claim-priority-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    required
                    />
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

            {/*policy info*/}

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

            <div className="search-recipient-container-box">
                <SearchRecipient onSearch={setRecipient}/>
            </div>

            <textarea
                id="message"
                className="message-content-textbox"
                rows="4"
                cols="40"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
            ></textarea>
        
            <button type="submit" className="send-button">Send</button>

        </form>
        </div>
      );
};

export default NewMessage;