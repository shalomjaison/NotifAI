# QUICK INFO

Access VM (up until late June 2025): http://20.169.212.247:9500 for frontend, http://20.169.212.247:3000 for backend

Currently, frontend server, backend server, and postgres database are on same machine, I believe all three can be on 3 separate machines, 
but haven't tested this (3 virtual machines too expensive, haha). **So, the guide below assumes deployment of all 3 on same machine.**

# HOW TO DEPLOY (NO CLOUD)

Configure .env file so that frontend, backend have the right ip addresses and port numbers. This will need you to find the ip address of your machine. For Macbook, go to Settings,
Wi-Fi, for the network you are connected to, click details, find your ip address. **This is not your computer's actual ip address**, just a temporary one provided by the network you are connected 
to, so it's ok to share this info. For Windows users, I am unsure, hopefully something similar. 

<img width="612" alt="Screenshot 2025-04-30 at 2 34 13 PM" src="https://github.com/user-attachments/assets/7b46ba9d-3ef7-46f8-9eda-064c0a1fbba9" />

<img width="612" alt="Screenshot 2025-04-30 at 2 34 52 PM" src="https://github.com/user-attachments/assets/ba59e15b-a88a-4687-8967-cd3cba81458d" />

Set the environment variable for FRONTEND_HOST and BACKEND_HOST to that ip address. 

<img width="1107" alt="Screenshot 2025-04-30 at 2 36 45 PM" src="https://github.com/user-attachments/assets/9a9119b1-e9e1-4ddc-80b7-194f6824b3a3" />

After this, when starting frontend and backend, any device on same local area network can use app. To expand outside of local area network to the internet, this is where I am unsure. Need
to configure router that provides the internet connection, also something about port forwarding (like forward to port 9500 on your machine to use frontend server at that port). To go internet level,
easier to deploy on cloud.

# HOW TO DEPLOY (MICROSOFT AZURE CLOUD)

No need for anything fancy such as multiple frontend/backend servers and load balancers, as not much experience with distributed systems. This will just be for creating 1 frontend and 1
backend server on one Ubuntu (Linux based) virtual machine. Since these virtual machines are managed by companies, they are configured to be accessible over internet
