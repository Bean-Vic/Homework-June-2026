const STATUS_DOT = {
  Alive:   'bg-green-400',
  Dead:    'bg-red-500',
  unknown: 'bg-gray-500',
};

export default function CharacterCard({ character }) {
  const { name, status, species, image, origin } = character;
  const dot = STATUS_DOT[status] ?? 'bg-gray-500';

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 hover:shadow-green-500/20 transition-all duration-200">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 space-y-1">
        <h2 className="font-bold text-white text-lg truncate">{name}</h2>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />
          <span className="text-sm text-gray-300">
            {status} — {species}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">
          Origin: {origin?.name ?? 'Unknown'}
        </p>
      </div>
    </div>
  );
}
