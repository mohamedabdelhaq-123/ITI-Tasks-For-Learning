import javax.swing.JFrame;
import javax.swing.JLabel;

import java.util.Date;
/* 
class MyThread extends Thread {
    // 2. Override run() -> This is the "Job" description
    public void run() {
        // ... write the job here
        // Overrides the run() method from the Thread class
        // This method contains the actual task you want the thread to execute
        System.out.println("Running in a separate thread");
    }
}

// 3. Usage
public class test
{   //Just a regular method where you'll create and start your thread
    // 3.a Create the object
    public static void main(String args[])
    {
        MyThread th = new MyThread();
        //Creates a new thread object
        //At this point, the thread exists but hasn't started yet

        th.start();
        //Starts the thread and tells the JVM to call the run() method in a separate thread
        //This is where the "magic" happens - your code now runs in parallel with the main program

    }

}
*/
//////////////////////////////////////////////// ///////////////////////////////////////////////////////////////

// 1. Define the Task (Separation of Concerns)
/* 
class MyTask implements Runnable 
{                          // better to use runnable because in extned your class extend one class only 
    // 2. Override run()
    public void run() 
    {
        // ... write the job here
        System.out.println("Running in a separate thread by Runnable");
    }
}

// 3. Usage

class test
{   //Just a regular method where you'll create and start your thread
    // 3.a Create the object
    public static void main(String args[])
    {
    
    MyTask task = new MyTask();
    //Creates a task object (the job to be done)
    //This is just the "job description" - not a thread yet

    
    Thread th = new Thread(task);
    //Creates a Thread object (the worker)
    //Passes the task to the thread as a parameter
    //Think of it as: hiring a worker and giving them a job to do

    th.start();
    }
}

/*************************************** */

// Class extends JFrame AND implements Runnable (Mixing concerns)
/* 
class DateTimeApp extends JFrame implements Runnable {
    Thread th;
    JLabel label;  // Create label ONCE

    public DateTimeApp()
     {
        // Setup frame ONCE in constructor
        this.setTitle("Time & Date App");
        this.setSize(600, 600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        
        label = new JLabel();  // Create label once
        label.setHorizontalAlignment(JLabel.CENTER);  // ✅ Center horizontally
        label.setVerticalAlignment(JLabel.CENTER);

        this.add(label);       // Add it once
        this.setVisible(true); // Show window once
        
        
        th = new Thread(this);
        th.start();
    }

    public void run() {
        while(true) {
            Date d = new Date();
            label.setText(d.toString());  // Just UPDATE the text!
            label.setLocation(300,300);
            
            try {
                Thread.sleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

class test {   
    public static void main(String args[]) {
        new DateTimeApp();
    }
}*/