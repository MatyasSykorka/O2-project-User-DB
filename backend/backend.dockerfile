FROM python:3.12.3-alpine

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run API using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]