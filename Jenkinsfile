pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello Jenkins - I'
            }
        }
        stage('Test') {
            when {
                branch "m*"
            }
            steps {
                echo 'Hello Jenkins - I'
            }
        }
    }
}
