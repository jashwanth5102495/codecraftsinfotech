import './SoftPro.css';

const logos = [
  { name: 'OpenAI', src: 'https://cdn.simpleicons.org/openai/ffffff' },
  { name: 'HuggingFace', src: 'https://cdn.simpleicons.org/huggingface/ffcc00' },
  { name: 'TensorFlow', src: 'https://cdn.simpleicons.org/tensorflow/ff6f00' },
  { name: 'PyTorch', src: 'https://cdn.simpleicons.org/pytorch/ee4c2c' },
  { name: 'Keras', src: 'https://cdn.simpleicons.org/keras/d00000' },
  { name: 'Scikit-learn', src: 'https://cdn.simpleicons.org/scikitlearn/f7931e' },
  { name: 'NVIDIA', src: 'https://cdn.simpleicons.org/nvidia/76b900' },
  { name: 'AWS', src: 'https://cdn.simpleicons.org/amazonaws/ffffff' },
  { name: 'Azure', src: 'https://cdn.simpleicons.org/microsoftazure/0078D4' },
  { name: 'Google Cloud', src: 'https://cdn.simpleicons.org/googlecloud/4285f4' },
];

const LogoMarquee = () => {
  // Duplicate for seamless loop
  const track = [...logos, ...logos];
  return (
    <section className="container mx-auto px-6 mt-16">
      <div className="logo-marquee">
        <div className="logo-track py-4">
          {track.map((l, idx) => (
            <span key={`${l.name}-${idx}`} className="logo-item">
              <img src={l.src} alt={l.name} loading="lazy" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;