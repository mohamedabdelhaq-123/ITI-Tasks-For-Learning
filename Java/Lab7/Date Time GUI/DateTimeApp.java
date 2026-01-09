/*import javax.swing.JFrame;
import javax.swing.JLabel;
import java.util.Date;
import java.awt.BorderLayout;

public class DateTimeApp extends JFrame implements Runnable
{
    Thread th; 
    Date d = new Date();
    JLabel timeLabel = new JLabel();
    public DateTimeApp()
    {
        this.setTitle("Date & Time Frame Application");
        timeLabel.setHorizontalAlignment(JLabel.CENTER);
        timeLabel.setText(d.toString());
        this.add(timeLabel,BorderLayout.CENTER);
        th = new Thread(this);
        th.start();
    }
    public static void main(String[] args)
    {
        DateTimeApp app = new DateTimeApp();
        app.setBounds(50,50,600,400);
        app.setVisible(true);
    }

    public void run()
    {
        while(true)
        {
            d= new Date();
            timeLabel.setText(d.toString());
            try 
            {
                Thread.sleep(1000);
            } 
            catch (InterruptedException e) 
            {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } // you’ll need to catch an exception
            // here
        }
    } // End of run
}*/
/* 
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.util.Date;
import java.awt.Graphics;
import java.awt.Font;
import java.awt.Color;

public class DateTimeApp extends JFrame implements Runnable
{
    Thread th; 
    Date d = new Date();
    BannerPanel panel = new BannerPanel();
    
    public DateTimeApp()
    {
        this.setTitle("Banner Application :)");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.add(panel);
        th = new Thread(this);
        th.start();
    }
    
    public static void main(String[] args)
    {
        DateTimeApp app = new DateTimeApp();
        app.setBounds(50, 50, 600, 400);
        app.setVisible(true);
    }

    public void run()
    {
        while(true)
        {
            d = new Date();
            panel.text = d.toString();
            panel.x -= 3; // Move left
            if (panel.x < -400) panel.x = 600; // Reset position
            panel.repaint();
            
            try 
            {
                Thread.sleep(30);
            } 
            catch (InterruptedException e) 
            {
                e.printStackTrace();
            }
        }
    }
}

class BannerPanel extends JPanel
{
    String text = "";
    int x = 6000; // Start from right
    
    protected void paintComponent(Graphics g)
    {
        super.paintComponent(g);
        setBackground(Color.LIGHT_GRAY);
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.setColor(Color.BLACK);
        g.drawString(text, x, getHeight() / 2);
    }
}*/