import javax.swing.*;
import java.awt.*;

class BouncingBall extends JPanel implements Runnable {
    Thread th;
    Image image;
    int xPosition = 50;
    int yPosition = 50;
    int xDirection = 5;  // Horizontal speed
    int yDirection = 5;  // Vertical speed
     int imageWidth = 100;   // Image size
    int imageHeight = 100;
    public BouncingBall() {
        image = new ImageIcon("/home/moabdelhaq/Pictures/Screenshots/Screenshot from 2025-12-06 09-55-03.png").getImage();

        th = new Thread(this);
        th.start();
    }

    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        
        // Draw the ball
         g.drawImage(image, xPosition, yPosition, imageWidth, imageHeight, this);

    }

    public void run() {
        while(true) {
            // Move the ball
            xPosition += xDirection;
            yPosition += yDirection;
            
            // Bounce off left and right edges
            if (xPosition <= 0 || xPosition >= getWidth() - imageWidth) {
                xDirection = -xDirection;
            }
            
            // Bounce off top and bottom edges
            if (yPosition <= 0 || yPosition >= getHeight() - imageHeight) {
                yDirection = -yDirection;
            }
            
            repaint();  // Redraw the ball
            
            try {
                Thread.sleep(20);  // Smooth animation
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

class AnimationBallBall {
    public static void main(String args[]) {
        JFrame frame = new JFrame("Bouncing Ball");
        BouncingBall ball = new BouncingBall();
        
        frame.add(ball);
        frame.setSize(600, 600);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
    }
}