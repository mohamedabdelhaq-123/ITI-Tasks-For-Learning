/*************************************** */
/* 
import javax.swing.JFrame;
import javax.swing.JLabel;
import java.util.Date;
// Class extends JFrame AND implements Runnable (Mixing concerns)
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

class DateTime {   
    public static void main(String args[]) {
        new DateTimeApp();
    }
}*/