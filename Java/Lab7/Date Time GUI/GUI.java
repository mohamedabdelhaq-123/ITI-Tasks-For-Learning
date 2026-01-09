import javax.swing.JFrame;
import java.util.Date;
/* 
public class GUI extends JFrame {
    Thread th;
    
    public GUI() {  // Constructor
        this.setTitle(new Date().toString());
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        th = new Thread(new DateTimeThread(this));  // Pass 'this' reference
        th.start();
    }

    public static void main(String[] args) {
        GUI app = new GUI();
        app.setBounds(50, 50, 600, 400);
        app.setVisible(true);
    }
}

class DateTimeThread implements Runnable {
    private GUI gui;  // Reference to GUI
    
    public DateTimeThread(GUI gui) {  // Constructor to receive GUI reference
        this.gui = gui;
    }
    
    public void run() {
        while(true) {
            try {
                Date d = new Date();
                gui.setTitle(d.toString());  // Update GUI's title
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;  // Exit thread if interrupted
            }
        }
    }
}*/