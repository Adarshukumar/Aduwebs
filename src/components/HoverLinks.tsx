import "./styles/style.css";

const HoverLinks = ({ text, cursor }: { text: string; cursor?: boolean }) => {
  return (
    <div className="hover-link" data-cursor={!cursor && `disable`}>
      <div className="hover-in">
        <span>{text}</span>
        {/* the second copy is the hover roll; hide it from assistive tech
            so links don't announce themselves twice */}
        <span aria-hidden="true">{text}</span>
      </div>
    </div>
  );
};

export default HoverLinks;
