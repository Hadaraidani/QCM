import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Composant pour afficher du texte avec des formules LaTeX
 * 
 * Utilisation dans le texte:
 * - Formules inline: $formule$ ou \(formule\)
 * - Formules block: $$formule$$ ou \[formule\]
 * 
 * Exemples:
 * - "La loi de Coulomb est $F = k \frac{q_1 q_2}{r^2}$"
 * - "L'équation est: $$E = mc^2$$"
 */
const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  // Fonction pour parser le texte et séparer les formules LaTeX
  const parseText = (input: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];
    let remaining = input;
    let key = 0;

    // Pattern pour les formules block ($$...$$ ou \[...\])
    const blockPattern = /\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]/;
    
    // Pattern pour les formules inline ($...$ ou \(...\))
    const inlinePattern = /\$([^\$]+?)\$|\\\(([^)]+?)\\\)/;

    while (remaining.length > 0) {
      const blockMatch = remaining.match(blockPattern);
      const inlineMatch = remaining.match(inlinePattern);

      // Déterminer quelle correspondance vient en premier
      let firstMatch: RegExpMatchArray | null = null;
      let isBlock = false;

      if (blockMatch && inlineMatch) {
        if (blockMatch.index! <= inlineMatch.index!) {
          firstMatch = blockMatch;
          isBlock = true;
        } else {
          firstMatch = inlineMatch;
          isBlock = false;
        }
      } else if (blockMatch) {
        firstMatch = blockMatch;
        isBlock = true;
      } else if (inlineMatch) {
        firstMatch = inlineMatch;
        isBlock = false;
      }

      if (firstMatch && firstMatch.index !== undefined) {
        // Ajouter le texte avant la formule
        if (firstMatch.index > 0) {
          elements.push(
            <span key={key++}>{remaining.substring(0, firstMatch.index)}</span>
          );
        }

        // Extraire la formule (groupe 1 ou 2 selon le pattern)
        const formula = firstMatch[1] || firstMatch[2];

        // Ajouter la formule LaTeX
        try {
          if (isBlock) {
            elements.push(
              <div key={key++} className="my-2">
                <BlockMath math={formula} />
              </div>
            );
          } else {
            elements.push(
              <InlineMath key={key++} math={formula} />
            );
          }
        } catch (error) {
          // Si erreur de parsing, afficher le texte brut
          elements.push(
            <span key={key++} className="text-red-500">{firstMatch[0]}</span>
          );
        }

        // Continuer avec le reste du texte
        remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
      } else {
        // Plus de formules, ajouter le reste du texte
        elements.push(<span key={key++}>{remaining}</span>);
        break;
      }
    }

    return elements;
  };

  return (
    <span className={`math-text ${className}`}>
      {parseText(text)}
    </span>
  );
};

export default MathText;
