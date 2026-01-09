import javax.swing.*;
import java.awt.*;
import java.util.Date;
/* 
class DateTimeApp extends JFrame implements Runnable {
    Thread th;
    JLabel label;
    int xPosition = 0;
    int speed = 5;  // Movement speed

    public DateTimeApp() 
    {
        this.setTitle("Time & Date App");
        this.setSize(600, 600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setLayout(null);
        
        label = new JLabel(); 
        label.setBounds(xPosition, 250, 400, 50);
        
        this.add(label);
        this.setVisible(true);
        
        th = new Thread(this);
        th.start();
    }

    public void run() {
        while(true) {
            Date d = new Date();
            label.setText(d.toString());
            
            // Move right
            xPosition += speed;
            
            // ✅ When it goes off the right edge, reset to left
            if (xPosition > this.getWidth()) 
            {
                xPosition = -label.getWidth();  // Start from left (off-screen)
            }
            
            label.setLocation(xPosition, 250);
            
            try {
                Thread.sleep(50);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

class TextBanner {   
    public static void main(String args[]) {
        new DateTimeApp();
    }
}*/