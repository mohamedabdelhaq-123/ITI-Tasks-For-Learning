public class tesst {
    public static void main(String args[])
    {

    tesssst t =new tesssst();
    t.add(3,4);
    perf.func(3,4,t);
    perf.func(3,4,(a,b)->a+b);   // lambda
    perf.func(3,4,t::add); // method ref. by obj from class
    perf.func(3,4,tessst::add); // method ref. if add is static
    perf.func(3,4,tessst::new); // method ref. if i need const.
    perf.func(3,4,tessst::add); // method ref. if there is no static so create new obj and let this obj call the add func.
}

}


class tesssst implements adder{

    public int add(int x,int y)
    {
        System.out.println(x+y);
        return x+y;
    }
}

interface adder {
    int add(int x,int y);    
}

class perf
{
    static int func(int x, int y, adder f)
    {
        return f.add(x,y);
    }
}
